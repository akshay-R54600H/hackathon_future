"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function AdminLogin() {
  const router = useRouter()
  const [eventID, setEventID] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await axios.post("http://127.0.0.1:5000/admin-login", {
        event_id: eventID,
        password: password,
      })

      localStorage.setItem("admin_token", response.data.token)
      router.push(`/organiser`)
    } catch (err) {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="p-6 w-full max-w-sm shadow-md">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Event ID</label>
            <Input
              type="text"
              value={eventID}
              onChange={(e) => setEventID(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full">Login</Button>
        </form>
      </Card>
    </div>
  )
}
