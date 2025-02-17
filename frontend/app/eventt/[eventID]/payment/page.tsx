"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { CheckCircleIcon } from "@heroicons/react/24/solid"

export default function PaymentOptions() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { eventID } = useParams() as { eventID: string } // ✅ Dynamically get eventID

  console.log("Extracted eventID:", eventID) // Debugging step

  const handlePayment = async () => {
    if (!eventID) {
      console.error("Missing eventID in URL")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/update-payment-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the user is authenticated
        },
        body: JSON.stringify({ event_id: eventID }), // ✅ Use dynamic eventID
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => router.push(`/eventt/${eventID}/payment/pass`), 1500) // Redirect smoothly
      }
    } catch (error) {
      console.error("Payment update failed:", error)
    }
    setLoading(false)
  }

  const handlePayLater = () => {
    if (!eventID) {
      console.error("Missing eventID in URL")
      return
    }
    router.push(`/eventt/${eventID}/payment/pass`)
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-[#e0e1dd]">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#415a77_0%,transparent_50%)] opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#778da9_0%,transparent_30%)] opacity-10" />

      {/* Content */}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center gap-12 px-4 py-20">
        <h2 className="bg-gradient-to-r from-[#1b263b] to-[#415a77] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Select Payment Option
        </h2>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <Button
            onClick={handlePayment}
            disabled={loading || success}
            className="group relative h-32 flex items-center justify-center overflow-hidden rounded-xl border-2 border-[#415a77]/20 bg-gradient-to-br from-[#415a77] to-[#1b263b] text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(65,90,119,0.3)]"
          >
            {success ? (
              <CheckCircleIcon className="h-12 w-12 text-green-500 animate-pulse" />
            ) : loading ? (
              "Processing..."
            ) : (
              "PAY NOW"
            )}
          </Button>

          <Button
            onClick={handlePayLater}
            className="group relative h-32 flex items-center justify-center overflow-hidden rounded-xl border-2 border-[#415a77]/20 bg-gradient-to-br from-[#415a77] to-[#1b263b] text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(65,90,119,0.3)]"
          >
            PAY LATER
          </Button>
        </div>

        {/* Decorative VIT Logo Watermark */}
        <div className="absolute bottom-4 right-4 opacity-10">
          <img src="https://vitchennaievents.com/img/logo.png" alt="" className="h-32 w-32" />
        </div>
      </div>
    </div>
  )
}
