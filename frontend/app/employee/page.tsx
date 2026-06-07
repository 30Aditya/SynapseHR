"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import EmployeeModal from "@/components/EmployeeModal";

interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  status: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees/");
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (employee: any) => {
    try {
      await api.post("/employees/", employee);

      fetchEmployees();

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditEmployee = async (employee: any) => {
    if (!selectedEmployee) return;

    try {
      await api.put(
        `/employees/${selectedEmployee.id}`,
        employee
      );

      fetchEmployees();

      setSelectedEmployee(null);

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEmployee = async (
    employeeId: number
  ) => {
    const confirmDelete = confirm(
      "Delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/employees/${employeeId}`);

      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.first_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      employee.last_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      employee.department
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-lg">
        Loading employees...
      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Employee Management
        </h1>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setSelectedEmployee(null);
            setIsModalOpen(true);
          }}
        >
          Add Employee
        </button>

      </div>

      <input
        type="text"
        placeholder="Search employees..."
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
                Code
              </th>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Department
              </th>

              <th className="p-4 text-left">
                Designation
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {filteredEmployees.map(
              (employee) => (
                <tr
                  key={employee.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {employee.employee_code}
                  </td>

                  <td className="p-4">
                    {employee.first_name}{" "}
                    {employee.last_name}
                  </td>

                  <td className="p-4">
                    {employee.email}
                  </td>

                  <td className="p-4">
                    {employee.department}
                  </td>

                  <td className="p-4">
                    {employee.designation}
                  </td>

                  <td className="p-4">
                    {employee.status}
                  </td>

                  <td className="p-4">

                    <div className="flex gap-2">

                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => {
                          setSelectedEmployee(
                            employee
                          );

                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() =>
                          handleDeleteEmployee(
                            employee.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={
          selectedEmployee
            ? handleEditEmployee
            : handleAddEmployee
        }
        initialData={selectedEmployee}
      />

    </div>
  );
}