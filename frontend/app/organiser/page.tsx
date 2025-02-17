"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EventTable from "@/components/ui/event-table";
import { QrCode, Lock, Download, LogOut } from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const router = useRouter();
  const [eventData, setEventData] = useState({ name: "Loading Event..." });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin-login");
      return;
    }

    axios
      .get("http://127.0.0.1:5000/admin-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEventData(response.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
        router.push("/admin-login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    router.push("/admin-login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="border-b bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/vit.png"
              alt="VIT Chennai Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-lg font-semibold text-[#1b263b]">
              VIT Chennai Events
            </span>
          </Link>
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <div className="flex flex-col gap-3">
            <Button className="h-12 w-full justify-start gap-2 bg-[#415a77] text-lg font-semibold text-white hover:bg-[#2d3f54]">
              EVENT ID
            </Button>
            <Button className="h-12 w-full justify-start gap-2 bg-[#415a77] text-lg font-semibold text-white hover:bg-[#2d3f54]">
              <QrCode className="h-5 w-5" /> SCAN QR
            </Button>
            <Button className="h-12 w-full justify-start gap-2 bg-[#415a77] text-lg font-semibold text-white hover:bg-[#2d3f54]">
              <Lock className="h-5 w-5" /> LOCK TABLE
            </Button>
            <Button className="h-12 w-full justify-start gap-2 bg-[#415a77] text-lg font-semibold text-white hover:bg-[#2d3f54]">
              <Download className="h-5 w-5" /> DOWNLOAD
            </Button>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-center text-3xl font-bold text-[#1b263b]">
              {eventData.name}
            </h1>
            <EventTable />
          </div>
        </div>
      </main>
    </div>
  );
}
