"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface Payroll {
  id: number;
  employee_id: number;
  month: string;
  basic_salary: number;
  deduction: number;
  net_salary: number;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
}

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] =
    useState("");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await api.get("/payroll/all");
      setPayrolls(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees/");
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const generatePayroll = async () => {
    if (!selectedEmployee) return;

    try {
      await api.post(
        `/payroll/generate/${selectedEmployee}`
      );

      fetchPayrolls();

      alert("Payroll generated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const filteredPayrolls = payrolls.filter(
    (payroll) =>
      payroll.employee_id
        .toString()
        .includes(search)
  );

  if (loading) {
    return (
      <div>
        Loading payroll records...
      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Payroll Management
        </h1>

      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Generate Payroll
        </h2>

        <div className="flex gap-4">

          <select
            value={selectedEmployee}
            onChange={(e) =>
              setSelectedEmployee(
                e.target.value
              )
            }
            className="border p-2 rounded"
          >
            <option value="">
              Select Employee
            </option>

            {employees.map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.first_name}{" "}
                {employee.last_name}
              </option>
            ))}
          </select>

          <button
            onClick={generatePayroll}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Generate
          </button>

        </div>

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
                Month
              </th>

              <th className="p-4 text-left">
                Basic Salary
              </th>

              <th className="p-4 text-left">
                Deduction
              </th>

              <th className="p-4 text-left">
                Net Salary
              </th>
            </tr>

          </thead>

          <tbody>

            {filteredPayrolls.map(
              (payroll) => (
                <tr
                  key={payroll.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {payroll.id}
                  </td>

                  <td className="p-4">
                    {payroll.employee_id}
                  </td>

                  <td className="p-4">
                    {payroll.month}
                  </td>

                  <td className="p-4">
                    ₹{payroll.basic_salary}
                  </td>

                  <td className="p-4">
                    ₹{payroll.deduction}
                  </td>

                  <td className="p-4 font-semibold">
                    ₹{payroll.net_salary}
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