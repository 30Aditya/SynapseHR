"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [employeeCount, setEmployeeCount] =
    useState(0);

  const [attendanceCount, setAttendanceCount] =
    useState(0);

  const [leaveCount, setLeaveCount] =
    useState(0);

  const [payrollCount, setPayrollCount] =
    useState(0);

  const [reviewCount, setReviewCount] =
    useState(0);

  const [candidateCount, setCandidateCount] =
    useState(0);

  const [highRiskCount, setHighRiskCount] =
    useState(0);

  const [departmentData, setDepartmentData] =
    useState<any[]>([]);

  const [attritionData, setAttritionData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        employees,
        attendance,
        leaves,
        payroll,
        reviews,
        candidates,
        attrition,
      ] = await Promise.all([
        api.get("/employees/"),
        api.get("/attendance/all-records"),
        api.get("/leave/all"),
        api.get("/payroll/all"),
        api.get("/performance/all"),
        api.get("/ai/candidates"),
        api.get("/attrition/all"),
      ]);

      setEmployeeCount(
        employees.data.length
      );

      setAttendanceCount(
        attendance.data.length
      );

      setLeaveCount(
        leaves.data.length
      );

      setPayrollCount(
        payroll.data.length
      );

      setReviewCount(
        reviews.data.length
      );

      setCandidateCount(
        candidates.data.length
      );

      const highRiskEmployees =
        attrition.data.filter(
          (employee: any) =>
            employee.risk_level ===
            "High"
        );

      setHighRiskCount(
        highRiskEmployees.length
      );

      const departments: Record<
        string,
        number
      > = {};

      employees.data.forEach(
        (employee: any) => {
          departments[
            employee.department
          ] =
            (departments[
              employee.department
            ] || 0) + 1;
        }
      );

      setDepartmentData(
        Object.entries(
          departments
        ).map(
          ([name, value]) => ({
            name,
            value,
          })
        )
      );

      const low =
        attrition.data.filter(
          (e: any) =>
            e.risk_level === "Low"
        ).length;

      const medium =
        attrition.data.filter(
          (e: any) =>
            e.risk_level === "Medium"
        ).length;

      const high =
        attrition.data.filter(
          (e: any) =>
            e.risk_level === "High"
        ).length;

      setAttritionData([
        {
          name: "Low",
          value: low,
        },
        {
          name: "Medium",
          value: medium,
        },
        {
          name: "High",
          value: high,
        },
      ]);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        SynapseHR Analytics Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">
            Employees
          </p>

          <h2 className="text-4xl font-bold">
            {employeeCount}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">
            Attendance
          </p>

          <h2 className="text-4xl font-bold">
            {attendanceCount}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">
            Leave Requests
          </p>

          <h2 className="text-4xl font-bold">
            {leaveCount}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">
            High Risk Employees
          </p>

          <h2 className="text-4xl font-bold text-red-600">
            {highRiskCount}
          </h2>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Employees by Department
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={departmentData}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Attrition Risk
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={attritionData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {attritionData.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={index}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-lg font-semibold mb-4">
            Recruitment
          </h2>

          <p>
            Candidates Screened:
            {" "}
            <strong>
              {candidateCount}
            </strong>
          </p>

        </div>

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-lg font-semibold mb-4">
            Performance
          </h2>

          <p>
            Reviews Recorded:
            {" "}
            <strong>
              {reviewCount}
            </strong>
          </p>

        </div>

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-lg font-semibold mb-4">
            Payroll
          </h2>

          <p>
            Payroll Records:
            {" "}
            <strong>
              {payrollCount}
            </strong>
          </p>

        </div>

      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-8">

        <h2 className="text-xl font-semibold mb-4">
          AI Insights
        </h2>

        <ul className="space-y-3">

          <li>
            ✅ Resume Screening Operational
          </li>

          <li>
            ✅ AI Interview Operational
          </li>

          <li>
            ✅ Candidate Ranking Active
          </li>

          <li>
            ⚠ High Risk Employees:
            {" "}
            {highRiskCount}
          </li>

          <li>
            📄 Candidates Screened:
            {" "}
            {candidateCount}
          </li>

        </ul>

      </div>

    </div>
  );
}