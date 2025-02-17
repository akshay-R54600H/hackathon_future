"use client"

import { Download } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface TicketData {
  studentName: string
  registrationNumber: string
  eventName: string
  eventDate: string
  eventId: string
  venue: string
  qrCodeUrl: string
}

export default function EventTicket() {
  const pathname = usePathname() // ✅ Get the full URL path
  const pathSegments = pathname.split("/") // ✅ Split the URL into parts
  const eventID = pathSegments[2] // ✅ Extract `eventID` from `/eventt/[eventID]/payment/event-pass`
  
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!eventID) return

    const fetchData = async () => {
      setLoading(true)
      setError("")

      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("User not authenticated.")
          return
        }

        // 🔹 Fetch Student Profile
        const profileRes = await fetch("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const profileData = await profileRes.json()
        if (!profileRes.ok) throw new Error(profileData.error || "Profile fetch failed")

        // 🔹 Fetch Event Details
        const eventRes = await fetch(`http://localhost:5000/event_details/${eventID}`)
        const eventData = await eventRes.json()
        if (!eventRes.ok) throw new Error(eventData.error || "Event fetch failed")

        // 🔹 Fetch QR Code
        const qrRes = await fetch("http://localhost:5000/generate-qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_regno: profileData.student_regno,
            event_id: eventID,
            paid_status: "paid",
          }),
        })
        const qrBlob = await qrRes.blob()
        const qrCodeUrl = URL.createObjectURL(qrBlob)

        setTicketData({
          studentName: profileData.student_name,
          registrationNumber: profileData.student_regno,
          eventName: eventData.name,
          eventDate: eventData.date,
          eventId: eventData.event_id,
          venue: eventData.venue,
          qrCodeUrl,
        })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventID])

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-4">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Pass
          </Button>
        </div>

        <Card className="w-full aspect-[2/1] flex overflow-hidden">
          {/* Left Section with Geometric Pattern */}
          <div className="w-1/4 bg-gray-900 p-6 relative overflow-hidden">
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="rotate-[-90deg] transform origin-center whitespace-nowrap">
                <h2 className="text-white text-xl font-bold tracking-wider">{ticketData?.eventName}</h2>
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-1 p-8 bg-white">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-6">{ticketData?.eventName}</h1>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Student Name</p>
                      <p className="font-semibold">{ticketData?.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration No.</p>
                      <p className="font-semibold">{ticketData?.registrationNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Event Date</p>
                      <p className="font-semibold">{ticketData?.eventDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-semibold">{ticketData?.venue}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full h-20 flex items-center justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-p7bTrceSgWXKG4gbbC8ix5D2u3DUuU.png"
                    alt="VIT Logo"
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - QR Code */}
          <div className="w-1/4 bg-gray-50 p-6 flex flex-col items-center justify-center space-y-4">
            {ticketData?.qrCodeUrl ? (
              <Image src={ticketData.qrCodeUrl} alt="QR Code" width={120} height={120} />
            ) : (
              <div className="w-full aspect-square bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-400 text-sm text-center">QR Code</div>
              </div>
            )}
            <p className="text-xs text-center text-gray-500">Scan to verify pass</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
