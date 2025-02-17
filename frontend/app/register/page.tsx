"use client";
import Image from "next/image"
import Link from "next/link"
import { UserPlus } from "lucide-react"
import { useState } from "react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [studentRegno, setStudentRegno] = useState("")
  const [studentName, setStudentName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:5000/register", {
        student_regno: studentRegno,
        student_name: studentName,
        password: password,
      })

      alert("Registration Successful! You can now log in.")
      setStudentRegno("")
      setStudentName("")
      setPassword("")
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#e0e1dd]">
      {/* Header */}
      <header className="bg-[#1b263b] px-4 py-3 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/vit.png"
              alt="VIT Logo"
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <h1 className="text-xl font-bold text-white">VIT Chennai Events</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#e0e1dd] hover:bg-white text-[#1b263b] border-[#778da9]"
            asChild
          >
            <Link href="/">HOME</Link>
          </Button>
        </div>
      </header>

      {/* Register Form */}
      <main className="mx-auto mt-16 max-w-md px-4">
        <div className="rounded-lg border border-[#778da9] bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-[#1b263b]">REGISTER</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="studentRegno" className="text-[#1b263b]">
                REGISTER NUMBER
              </Label>
              <Input
                id="studentRegno"
                type="text"
                required
                value={studentRegno}
                onChange={(e) => setStudentRegno(e.target.value)}
                className="border-[#778da9] focus:border-[#415a77] focus:ring-[#415a77]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentName" className="text-[#1b263b]">
                NAME
              </Label>
              <Input
                id="studentName"
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="border-[#778da9] focus:border-[#415a77] focus:ring-[#415a77]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1b263b]">
                PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#778da9] focus:border-[#415a77] focus:ring-[#415a77]"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              className="w-full bg-[#415a77] hover:bg-[#1b263b] text-white transition-colors"
              type="submit"
              disabled={loading}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
