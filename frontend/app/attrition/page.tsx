"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface AttritionData {
  employee_id: number;
  employee_name: string;
  department: string;
  attendance_count: number;
  approved_leaves: number;
  performance_rating: number;
  risk_score: number;
  risk_level: string;
}

export default function AttritionPage() {
  const [data, setData] =
    useState<AttritionData[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response =
        await api.get(
          "/attrition/all"
        );

      setData(response.data);
    } catch (error) {
      console.error(error);
      alert(
        "Failed to load attrition data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        Loading attrition analysis...
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        AI Attrition Prediction
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="p-4 text-left">
                Employee
              </th>

              <th className="p-4 text-left">
                Department
              </th>

              <th className="p-4 text-left">
                Attendance
              </th>

              <th className="p-4 text-left">
                Leaves
              </th>

              <th className="p-4 text-left">
                Rating
              </th>

              <th className="p-4 text-left">
                Risk Score
              </th>

              <th className="p-4 text-left">
                Risk Level
              </th>
            </tr>

          </thead>

          <tbody>

            {data.map(
              (employee) => (
                <tr
                  key={
                    employee.employee_id
                  }
                  className="border-t"
                >

                  <td className="p-4">
                    {
                      employee.employee_name
                    }
                  </td>

                  <td className="p-4">
                    {
                      employee.department
                    }
                  </td>

                  <td className="p-4">
                    {
                      employee.attendance_count
                    }
                  </td>

                  <td className="p-4">
                    {
                      employee.approved_leaves
                    }
                  </td>

                  <td className="p-4">
                    {
                      employee.performance_rating
                    }
                  </td>

                  <td className="p-4">
                    {
                      employee.risk_score
                    }
                  </td>

                  <td className="p-4">

                    {employee.risk_level ===
                    "High" ? (
                      <span>
                        🔴 High
                      </span>
                    ) : employee.risk_level ===
                      "Medium" ? (
                      <span>
                        🟡 Medium
                      </span>
                    ) : (
                      <span>
                        🟢 Low
                      </span>
                    )}

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