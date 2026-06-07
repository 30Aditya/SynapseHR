"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  check_in: string;
  check_out: string;
  status: string;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get(
        "/attendance/all-records"
      );

      setRecords(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(
    (record) =>
      record.employee_id
        .toString()
        .includes(search)
  );

  if (loading) {
    return (
      <div className="text-lg">
        Loading attendance records...
      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Attendance Management
        </h1>

      </div>

      <input
        type="text"
        placeholder="Search Employee ID"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="border rounded px-4 py-2 mb-6 w-80"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="p-4 text-left">
                ID
              </th>

              <th className="p-4 text-left">
                Employee ID
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Check In
              </th>

              <th className="p-4 text-left">
                Check Out
              </th>

              <th className="p-4 text-left">
                Status
              </th>
            </tr>

          </thead>

          <tbody>

            {filteredRecords.map(
              (record) => (
                <tr
                  key={record.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {record.id}
                  </td>

                  <td className="p-4">
                    {record.employee_id}
                  </td>

                  <td className="p-4">
                    {record.date}
                  </td>

                  <td className="p-4">
                    {record.check_in}
                  </td>

                  <td className="p-4">
                    {record.check_out || "-"}
                  </td>

                  <td className="p-4">
                    {record.status}
                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}