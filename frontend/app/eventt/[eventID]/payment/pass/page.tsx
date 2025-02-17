"use client"

import { Download } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/navbar"

<Navbar />
interface TicketData {
  studentName: string
  registrationNumber: string
  eventName: string
  eventDate: string
  eventId: string
  venue: string
}

export default function EventTicket() {
  const [ticketData, setTicketData] = useState<TicketData>({
    studentName: "John Doe",
    registrationNumber: "2023CS001",
    eventName: "Tech Summit 2024",
    eventDate: "March 15, 2024",
    eventId: "EVT001",
    venue: "Main Auditorium",
  })

  const handleDownloadPDF = () => {
    // Implement PDF download logic here
    console.log("Downloading pass as PDF...")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-4">
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download Pass
          </Button>
        </div>

        <Card className="w-full aspect-[2/1] flex overflow-hidden">
          {/* Left Section with Geometric Pattern */}
          <div className="w-1/4 bg-gray-900 p-6 relative overflow-hidden">
            {/* Geometric Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-40 h-40 bg-blue-500 rotate-45 transform -translate-x-20 -translate-y-20" />
                <div className="w-40 h-40 bg-cyan-500 rotate-45 transform translate-x-20 translate-y-20" />
                <div className="w-40 h-40 bg-indigo-500 rotate-45 transform translate-x-40 translate-y-40" />
              </div>
            </div>
            {/* Event Name */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="rotate-[-90deg] transform origin-center whitespace-nowrap">
                <h2 className="text-white text-xl font-bold tracking-wider">{ticketData.eventName}</h2>
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-1 p-8 bg-white">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-6">{ticketData.eventName}</h1>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Student Name</p>
                      <p className="font-semibold">{ticketData.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration No.</p>
                      <p className="font-semibold">{ticketData.registrationNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Event Date</p>
                      <p className="font-semibold">{ticketData.eventDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-semibold">{ticketData.venue}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full h-20 flex items-center justify-center">
                  <Image
                    src=""
                    alt="VIT Logo"
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/4 bg-gray-50 p-6 flex flex-col items-center justify-center space-y-4">
            {/* Placeholder for QR Code */}
            <div className="w-full aspect-square bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-sm text-center">QR Code</div>
            </div>
            <p className="text-xs text-center text-gray-500">Scan to verify pass</p>
          </div>
        </Card>
      </div>
    </div>
  )
}