"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export default function QrScanner({ onScanSuccess }: QrScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const width = window.innerWidth;
  const qrSize = width < 600 ? 200 : 350;

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-scanner",
        { fps: 10, qrbox: qrSize },
        false
      );

      scannerRef.current.render(
        async (decodedText) => {
          console.log("QR Code scanned:", decodedText);
          try {
            const token = localStorage.getItem("admin_token");
            if (!token) {
              console.error("No token found");
              return;
            }

            await axios.post(
              "http://127.0.0.1:5000/update-attendance",
              { student_regno: decodedText },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            

            onScanSuccess(decodedText);
            setTimeout(() => scannerRef.current?.clear(), 2000); // Reset scanner after scan
          } catch (error) {
            console.error("Error updating attendance", error);
          }
        },
        (error) => {
          console.warn("QR Scan Error:", error);
        }
      );
    }
  }, [onScanSuccess]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center">Scan QR Code</h2>
      <div id="qr-scanner" className="mt-4" />
    </div>
  );
}
