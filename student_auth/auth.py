from flask import Flask, request, jsonify
import psycopg2
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
import datetime
from flask_cors import CORS
from psycopg2.extras import RealDictCursor
from datetime import timedelta
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configure JWT Secret Key
app.config['JWT_SECRET_KEY'] = 'acdfwrbmnhjfdbgdvmjgbdkdjn'  # Change this to a secure key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=100)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)


# Database Connection Function
def get_db_connection():
    return psycopg2.connect(
        dbname="event_db",
        user="postgres",
        password="akshay2006",  # Change this
        host="localhost",
        port=5432
    )

### **🔹 User Registration Route**
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    student_regno = data.get("student_regno")
    student_name = data.get("student_name")
    password = data.get("password")

    if not student_regno or not student_name or not password:
        return jsonify({"error": "Missing fields"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')  # Hash password

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO students (student_regno, student_name, password) VALUES (%s, %s, %s)",
            (student_regno, student_name, hashed_password),
        )
        conn.commit()
    except psycopg2.Error:
        return jsonify({"error": "User already exists or invalid input"}), 400
    finally:
        cur.close()
        conn.close()

    return jsonify({"message": "Registration successful"}), 201

### **🔹 User Login Route**
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    student_regno = data.get("student_regno")
    password = data.get("password")

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT password FROM students WHERE student_regno = %s", (student_regno,))
    result = cur.fetchone()
    
    cur.close()
    conn.close()

    if result is None:
        return jsonify({"error": "Invalid credentials"}), 401

    hashed_password = result[0]

    if not bcrypt.check_password_hash(hashed_password, password):  # Verify password
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=student_regno)  # Generate JWT token

    return jsonify({"message": "Login successful", "token": access_token}), 200

### **🔹 Get Profile Route**
@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    student_regno = get_jwt_identity()  # Get user ID from the token

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT student_regno, student_name FROM students WHERE student_regno = %s", (student_regno,))
    user = cur.fetchone()
    
    cur.close()
    conn.close()

    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "student_regno": user[0],
        "student_name": user[1]
    }), 200


### **🔹 Admin Login Route**
@app.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.json
    event_id = data.get("event_id")
    password = data.get("password")

    if not event_id or not password:
        return jsonify({"error": "Missing event_id or password"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch event details
    cursor.execute("SELECT name, password FROM events WHERE event_id = %s", (event_id,))
    event = cursor.fetchone()
    cursor.close()
    conn.close()

    if not event:
        return jsonify({"error": "Invalid event ID"}), 401

    event_name, stored_password = event

    if password != stored_password:  # Direct comparison
        return jsonify({"error": "Invalid password"}), 401

    # Generate JWT Token
    token_payload = {
        "event_id": event_id,
        "event_name": event_name,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)  # Token expires in 2 hours
    }
    token = create_access_token(identity=event_id, additional_claims=token_payload)

    return jsonify({"token": token, "event_id": event_id, "event_name": event_name}), 200


### **🔹 Admin Profile Route (NEW)**
@app.route('/admin-profile', methods=['GET'])
@jwt_required()  # Requires a valid JWT token
def admin_profile():
    event_id = get_jwt_identity()  # Extract event ID from JWT

    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch event details
    cursor.execute("SELECT event_id, name FROM events WHERE event_id = %s", (event_id,))
    event = cursor.fetchone()
    cursor.close()
    conn.close()

    if not event:
        return jsonify({"error": "Event not found"}), 404

    return jsonify({
        "event_id": event[0],
        "name": event[1]
    }), 200



@app.route("/register_event", methods=["POST"])
@jwt_required()
def register_event():
    student_regno = get_jwt_identity()  # ✅ Extract student_regno from JWT token

    if not student_regno:  # 🔥 Ensure identity is extracted
        return jsonify({"error": "Invalid token. User not authenticated."}), 401

    data = request.get_json()
    event_id = data.get("event_id")
    email = data.get("email")
    phone_no = data.get("phone_no")

    if not event_id or not email or not phone_no:
        return jsonify({"error": "Missing required fields"}), 400

    print("Decoded JWT Identity:", student_regno)  # ✅ Now student_regno is always defined

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO registrations (student_regno, event_id, email, phone_no) VALUES (%s, %s, %s, %s)",
            (student_regno, event_id, email, phone_no),
        )
        conn.commit()
        return jsonify({"message": "Registration successful!"}), 201
    except psycopg2.IntegrityError as e:
        conn.rollback()
        return jsonify({"error": "Already registered or invalid input"}), 400
    finally:
        cur.close()
        conn.close()


### **🔹 Event Details Route**
@app.route('/event_details/<event_id>', methods=['GET'])
def event_details(event_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT event_id, name, venue, date FROM events WHERE event_id = %s", (event_id,))
    event = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    return jsonify({
        "event_id": event[0],
        "name": event[1],
        "venue": event[2],
        "date": event[3]
    }), 200

@app.route("/events", methods=["GET"])
def get_events():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT event_id, name, venue, date FROM events LIMIT 6;")
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(events)
    except Exception as e:
        return jsonify({"error": str(e)}), 500 #yss
    
if __name__ == '__main__':
    app.run(debug=True)
