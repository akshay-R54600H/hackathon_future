"use client"

import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#415a77] bg-gradient-to-r from-[#1b263b] to-[#415a77] px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#e0e1dd] p-2">
            <img src="/placeholder.svg?height=40&width=40" alt="VIT Logo" className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e0e1dd]">VIT CHENNAI EVENTS</h1>
        </div>
        <Button
          variant="ghost"
          className="font-semibold text-[#e0e1dd] transition-all hover:bg-[#778da9] hover:text-white"
          asChild
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
    </nav>
  )
}