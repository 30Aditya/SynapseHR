"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

export default function LeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get("/leave/all");
      setLeaves(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (leaveId: number) => {
    try {
      await api.put(`/leave/${leaveId}/approve`);
      fetchLeaves();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectLeave = async (leaveId: number) => {
    try {
      await api.put(`/leave/${leaveId}/reject`);
      fetchLeaves();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredLeaves = leaves.filter((leave) =>
    leave.employee_id.toString().includes(search)
  );

  if (loading) {
    return <div>Loading leave requests...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Leave Management
        </h1>
      </div>

      <input
        type="text"
        placeholder="Search Employee ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-4 py-2 mb-6 w-80"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Employee ID</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Start Date</th>
              <th className="p-4 text-left">End Date</th>
              <th className="p-4 text-left">Reason</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeaves.map((leave) => (
              <tr
                key={leave.id}
                className="border-t"
              >
                <td className="p-4">{leave.id}</td>

                <td className="p-4">
                  {leave.employee_id}
                </td>

                <td className="p-4">
                  {leave.leave_type}
                </td>

                <td className="p-4">
                  {leave.start_date}
                </td>

                <td className="p-4">
                  {leave.end_date}
                </td>

                <td className="p-4">
                  {leave.reason}
                </td>

                <td className="p-4">
                  {leave.status}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        approveLeave(leave.id)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectLeave(leave.id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}