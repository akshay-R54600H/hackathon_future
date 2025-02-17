"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/navbar";

export default function EventRegistration() {
  const [formData, setFormData] = useState({
    teamName: "",
    email: "",
    phoneNo: "",
  });
  const [eventDetails, setEventDetails] = useState<{ event_id: string; name: string; venue: string; date: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { eventID } = useParams();
  const eventId = eventID as string;

  useEffect(() => {
    if (eventId) {
      fetchEventDetails(eventId);
    }
  }, [eventId]);

  const fetchEventDetails = async (eventId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/event_details/${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event details");
      }
      const data = await response.json();
      setEventDetails(data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const token = localStorage.getItem("token"); // Retrieve JWT token
  
    if (!token) {
      alert("User is not authenticated. Redirecting to login...");
      router.push("/login");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5000/register_event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Ensure JWT token is sent
        },
        body: JSON.stringify({
          event_id: parseInt(eventId, 10),  // 🔥 Convert eventId to integer
          team_name: formData.teamName,
          email: formData.email,
          phone_no: formData.phoneNo,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("🎉 Registration successful!");
        setFormData({ teamName: "", email: "", phoneNo: "" });
      } else {
        alert(data.error || "❌ Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Navbar />
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-2 border-[#415a77] bg-white shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#415a77] to-[#778da9]">
            <CardTitle className="text-2xl text-[#e0e1dd]">
              {eventDetails?.name || "Event"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-lg text-[#1b263b]">
            <p><strong>Venue:</strong> {eventDetails?.venue || "N/A"}</p>
            <p><strong>Date:</strong> {eventDetails?.date || "N/A"}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#415a77] bg-white shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#415a77] to-[#778da9]">
            <CardTitle className="text-2xl text-[#e0e1dd]">Register Now</CardTitle>
          </CardHeader>
          <CardContent className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone No</Label>
                <Input
                  id="phoneNo"
                  type="tel"
                  value={formData.phoneNo}
                  onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#415a77] text-white text-lg font-semibold"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
