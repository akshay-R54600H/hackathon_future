"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { QrCode, Download } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<StudentData[]>([]);
  const [eventId, setEventId] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);

  interface StudentData {
    student_name: string;
    student_regno: string;
    paid_status: boolean;
    attendance: string;
  }

  interface DecodedToken {
    event_id: string;
  }

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin-login");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setEventId(decoded.event_id);
    } catch (error) {
      console.error("Invalid token", error);
      router.push("/admin-login");
      return;
    }
  }, [router]);

  // Fetch Event Registrations
  const fetchEventData = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const response = await axios.get(
        "http://localhost:5000/admin-event-registrations",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, []);

  // Fetch Data Every Second
  useEffect(() => {
    fetchEventData(); // Fetch once on mount

    const interval = setInterval(fetchEventData, 1000);
    return () => clearInterval(interval);
  }, [fetchEventData]);

  const startQRScanner = () => {
    if (scanning) return;

    scannerRef.current = new Html5Qrcode("qr-reader");

    scannerRef.current.start(
      { facingMode: "environment" },
      { fps: 15, qrbox: 250 },
      async (decodedText) => {
        try {
          const qrData = JSON.parse(decodedText);
          console.log("QR Code Data:", qrData);

          if (qrData.event_id !== eventId) {
            alert("Wrong event pass");
            return;
          }

          const student = data.find((s) => s.student_regno === qrData.student_regno);

          if (!student) {
            alert("Student not found");
            return;
          }

          await axios.post(
            "http://localhost:5000/update-attendance",
            { student_regno: qrData.student_regno },
            { headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` } }
          );

          alert("Attendance marked successfully!");
          fetchEventData(); // Fetch updated attendance immediately
        } catch (error) {
          console.error("Error processing QR code", error);
          alert("Invalid QR Code");
        }
      },
      (errorMessage) => {
        console.warn("QR Scan Error:", errorMessage);
      }
    );

    setScanning(true);
  };

  const stopQRScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current = null;
        setScanning(false);
      });
    }
  };

  // **Download Table as Excel File**
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Event Registrations");
    
    // Save the file
    XLSX.writeFile(workbook, `Event_Registrations.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Button
        onClick={startQRScanner}
        className="mb-4 bg-blue-600 text-white hover:bg-blue-800"
      >
        <QrCode className="h-5 w-5 mr-2" /> Scan QR
      </Button>

      <Button
        onClick={stopQRScanner}
        className="mb-4 ml-4 bg-red-600 text-white hover:bg-red-800"
      >
        Stop Scanner
      </Button>

      <Button
        onClick={downloadExcel}
        className="mb-4 ml-4 bg-green-600 text-white hover:bg-green-800"
      >
        <Download className="h-5 w-5 mr-2" /> Download Excel
      </Button>

      <div id="qr-reader" className="mb-8" />

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Sl. No.</th>
            <th className="py-2 px-4">Student Name</th>
            <th className="py-2 px-4">Reg. No.</th>
            <th className="py-2 px-4">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{row.student_name}</td>
              <td className="py-2 px-4">{row.student_regno}</td>
              <td className="py-2 px-4">{row.attendance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
