"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { XCircle, QrCode, Lock, Download, LogOut } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function AdminDashboard() {
  const router = useRouter();
  const [eventData, setEventData] = useState({ name: "Loading Event..." });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudentData[]>([]);

  interface StudentData {
    student_name: string;
    student_regno: string;
    paid_status: boolean;
    attendance: string;
  }

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

    const fetchEventData = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          console.error("No token found");
          return;
        }

        // Decode JWT to get event_id
        const decodedToken: any = jwtDecode(token);
        const event_id = decodedToken.sub;
        console.log("Event ID:", event_id);

        const response = await fetch("http://localhost:5000/admin-event-registrations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          console.error("Error fetching data", result);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchEventData();
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
            <Image src="/vit.png" alt="VIT Chennai Logo" width={40} height={40} className="rounded-full" />
            <span className="text-lg font-semibold text-[#1b263b]">VIT Chennai Events</span>
          </Link>
          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="outline" className="gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <div className="flex flex-col gap-3">
            <Button className="h-12 w-full justify-start gap-2 bg-[#415a77] text-lg font-semibold text-white hover:bg-[#2d3f54]">EVENT ID</Button>
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
            <h1 className="mb-6 text-center text-3xl font-bold text-[#1b263b]">{eventData.name}</h1>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f1f5f9] hover:bg-[#f1f5f9]">
                    <TableHead className="text-[#1b263b]">Sl.No.</TableHead>
                    <TableHead className="text-[#1b263b]">Student Name</TableHead>
                    <TableHead className="text-[#1b263b]">Reg. No.</TableHead>
                    <TableHead className="text-[#1b263b]">Attendance</TableHead>
                    <TableHead className="text-[#1b263b]">Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0 ? (
                    data.map((row, index) => (
                      <TableRow key={index} className="hover:bg-[#f8fafc]">
                        <TableCell className="text-[#1b263b]">{index + 1}</TableCell>
                        <TableCell className="text-[#1b263b]">{row.student_name}</TableCell>
                        <TableCell className="text-[#1b263b]">{row.student_regno}</TableCell>
                        <TableCell>{row.attendance}</TableCell>
                        <TableCell><Checkbox checked={row.paid_status} disabled /></TableCell>
                      </TableRow>
                    ))
                  ) : <TableRow><TableCell colSpan={5} className="text-center">No Data Available</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
