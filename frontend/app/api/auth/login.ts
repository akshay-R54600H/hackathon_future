import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import jwt from "jsonwebtoken";
import Cookies from "cookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { student_regno, password } = req.body;

  try {
    // Call Flask API to authenticate user
    const response = await axios.post("http://127.0.0.1:5000/login", {
      student_regno,
      password,
    });

    const { token } = response.data;

    // Store JWT in HttpOnly Cookie
    const cookies = new Cookies(req, res);
    cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
if (axios.isAxiosError(error)) {
  console.error("Login error:", error.response?.data || error.message);
  res.status(error.response?.status || 500).json({
    error: error.response?.data?.error || "Something went wrong",
  });
} else {
  console.error("Login error:", error);
  res.status(500).json({
    error: "Something went wrong",
  });
}

  }
}
