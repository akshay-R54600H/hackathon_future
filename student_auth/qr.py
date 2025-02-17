import qrcode
import io
import base64
from flask import Flask, request, jsonify, send_file  # ✅ Ensure send_file is imported

from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# PostgreSQL connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:akshay2006@localhost:5432/event_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    venue = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)

class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

class Registration(db.Model):
    __tablename__ = 'registrations'
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    paid = db.Column(db.Boolean, default=False)

    event = db.relationship('Event', backref=db.backref('registrations', lazy=True))
    student = db.relationship('Student', backref=db.backref('registrations', lazy=True))

# ✅ Generate QR Code (Base64 format for frontend)
@app.route('/generate_qr', methods=['GET'])
def generate_qr():
    event_id = request.args.get('event_id')
    student_id = request.args.get('student_id')

    registration = Registration.query.filter_by(event_id=event_id, student_id=student_id).first()
    if not registration:
        return jsonify({"error": "Registration not found"}), 404  # Ensure error is handled properly

    # Generate QR Code
    qr_data = f"event_id:{event_id},student_id:{student_id},paid:{registration.paid}"
    qr = qrcode.make(qr_data)
    
    # Save QR as a byte stream
    img_io = io.BytesIO()
    qr.save(img_io, format='PNG')
    img_io.seek(0)
    
    return send_file(img_io, mimetype='image/png') 

# ✅ Get Event Pass Details
@app.route('/get_event_pass', methods=['GET'])
def get_event_pass():
    event_id = request.args.get('event_id')
    student_id = request.args.get('student_id')

    registration = Registration.query.filter_by(event_id=event_id, student_id=student_id).first()
    if not registration:
        return jsonify({"error": "Registration not found"}), 404

    event = registration.event
    student = registration.student

    return jsonify({
        "event_id": event.id,
        "event_name": event.name,
        "venue": event.venue,
        "date": str(event.date),
        "student_id": student.id,
        "student_name": student.name,
        "paid": registration.paid
    })

if __name__ == '__main__':
    app.run(debug=True)
