import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  cookies.set("auth_token", "", { httpOnly: true, expires: new Date(0), path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
}
