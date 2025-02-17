"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [studentRegno, setStudentRegno] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_regno: studentRegno, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful", data);
        localStorage.setItem("token", data.token); // Store token in localStorage
        router.push("/"); // Redirect on success
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <Image src="/vit.png" alt="VIT Logo" width={50} height={50} />
          <h2 className="text-2xl font-bold text-gray-800">VIT Chennai Events</h2>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="studentRegno" className="text-gray-700">
              Registration Number
            </Label>
            <Input
              id="studentRegno"
              type="text"
              required
              value={studentRegno}
              onChange={(e) => setStudentRegno(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button className="w-full bg-blue-600 hover:bg-blue-800 text-white" type="submit">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
