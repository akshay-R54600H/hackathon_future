"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { LogIn, LogOut, LayoutDashboard, User, Calendar, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfile {
  student_name: string;
  student_regno: string;
}

interface EventDetails {
  event_id: string;
  name: string;
  date: string;
  venue: string;
  description: string;
}

export default function EventsDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState<EventDetails[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Fetch event details
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    console.log("Stored token:", token);  // Debugging
  
    if (!token) {
      alert("You are not logged in!");
      return;
    }
  
    try {
      const res = await fetch("http://127.0.0.1:5000/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Response status:", res.status);
  
      if (!res.ok) {
        const errorText = await res.text(); // Get response body for debugging
        throw new Error(`Failed to fetch profile: ${errorText}`);
      }
  
      const data = await res.json();
      console.log("Fetched profile data:", data);
  
      setUser(data);
      setShowProfile(true);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 to-primary/10 dark:from-primary-dark dark:to-accent">
      <header className="border-b bg-muted/50 backdrop-blur-sm dark:bg-primary-dark/50">
        <div className="container flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Image
              src="/vit.png"
              alt="VIT Logo"
              width={40}
              height={40}
              className="rounded-full bg-white p-1"
            />
            <h1 className="text-2xl font-bold text-primary-dark dark:text-primary-foreground">
              VIT Chennai Events
            </h1>
          </div>

          {isLoggedIn ? (
            <Button
              variant="outline"
              className="gap-2 border-primary hover:bg-red-500 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="gap-2 border-primary hover:bg-primary hover:text-primary-foreground">
                <LogIn className="w-4 h-4" /> Login
              </Button>
            </Link>
          )}
        </div>
      </header>

      <div className="container grid lg:grid-cols-[240px_1fr] gap-4 p-4">
        <nav className="space-y-2 lg:border-r lg:pr-4 border-primary/20">
          {[
            { icon: LayoutDashboard, label: "Dashboard" },
            { icon: User, label: "Profile", onClick: fetchProfile },
            { icon: Calendar, label: "My Events" },
          ].map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-primary hover:text-primary-foreground"
              onClick={item.onClick}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </Button>
          ))}
        </nav>

        <main className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-primary-dark dark:text-primary-foreground">
              Upcoming Events
            </h2>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.length > 0 ? (
              events.map((event) => (
                <Card
                  key={event.event_id}
                  className="group relative overflow-hidden border-primary/20 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => router.push(`/eventt/${event.event_id}`)}
                >
                  <div className="p-6 space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground font-bold mb-4 group-hover:scale-110 transition-transform">
                      {event.event_id}
                    </div>
                    <h3 className="font-semibold text-primary-dark dark:text-primary-foreground">
                      {event.name}
                    </h3>
                    <p className="text-sm text-primary-dark/70 dark:text-primary-foreground/70">
                      {event.description}
                    </p>
                    <p className="text-xs text-primary-dark/50 dark:text-primary-foreground/50">
                      📍 {event.venue} | 📅 {event.date}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-light/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">No events available</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
