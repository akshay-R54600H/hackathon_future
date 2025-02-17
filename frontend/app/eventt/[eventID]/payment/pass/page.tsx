"use client";
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface EventPass {
  event_id: string;
  event_name: string;
  venue: string;
  date: string;
  paid_status: boolean;
}

const EventPassPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const eventID = pathSegments[2];
  const [eventPass, setEventPass] = useState<EventPass | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !eventID) return;

    const fetchEventPass = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/get_event_pass?event_id=${eventID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEventPass(res.data);
      } catch (error) {
        console.error("Error fetching event pass details:", error);
      }
    };

    const fetchQRCode = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/generate_qr?event_id=${eventID}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        });
        setQrCodeUrl(URL.createObjectURL(res.data));
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    fetchEventPass();
    fetchQRCode();
  }, [eventID]);

  if (!eventPass) return <p>Loading event details...</p>;

  return (
    <div className="p-4 rounded-lg shadow-md bg-white max-w-md mx-auto mt-8">
      <h1 className="text-xl font-bold mb-2">{eventPass.event_name}</h1>
      <p><strong>Venue:</strong> {eventPass.venue}</p>
      <p><strong>Date:</strong> {eventPass.date}</p>
      <p><strong>Paid:</strong> {eventPass.paid_status ? 'Yes' : 'No'}</p>

      <h2 className="text-lg font-semibold mt-4">Your QR Code:</h2>
      {qrCodeUrl && <img src={qrCodeUrl} alt="Event Pass QR Code" className="mt-2" />}
    </div>
  );
};

export default EventPassPage;