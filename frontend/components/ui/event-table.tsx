"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, XCircle } from "lucide-react"

const mockData = [
  {
    id: 1,
    name: "John Doe",
    regNo: "21BCE1001",
    paid: true,
    attendance: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    regNo: "21BCE1002",
    paid: false,
    attendance: false,
  },
  // Add more mock data as needed
]

export default function EventTable() {
  return (
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
          {mockData.map((row) => (
            <TableRow key={row.id} className="hover:bg-[#f8fafc]">
              <TableCell className="text-[#1b263b]">{row.id}</TableCell>
              <TableCell className="text-[#1b263b]">{row.name}</TableCell>
              <TableCell className="text-[#1b263b]">{row.regNo}</TableCell>
              <TableCell>
                {row.attendance ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={row.paid}
                  className="border-[#415a77] data-[state=checked]:bg-[#415a77] data-[state=checked]:text-white"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}