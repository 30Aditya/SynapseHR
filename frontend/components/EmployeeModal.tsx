"use client";

import { useState, useEffect } from "react";

interface Employee {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  status: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: Employee) => void;
  initialData?: Employee | null;
}

export default function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<Employee>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: 0,
    status: "Active",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        salary: 0,
        status: "Active",
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          {initialData ? "Edit Employee" : "Add Employee"}
        </h2>

        <div className="grid grid-cols-2 gap-3">

          <input
            className="border p-2 rounded"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                first_name: e.target.value,
              })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                last_name: e.target.value,
              })
            }
          />

          <input
            className="border p-2 rounded col-span-2"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <input
            className="border p-2 rounded col-span-2"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Department"
            value={formData.department}
            onChange={(e) =>
              setFormData({
                ...formData,
                department: e.target.value,
              })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Designation"
            value={formData.designation}
            onChange={(e) =>
              setFormData({
                ...formData,
                designation: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Salary"
            value={formData.salary}
            onChange={(e) =>
              setFormData({
                ...formData,
                salary: Number(e.target.value),
              })
            }
          />

          <select
            className="border p-2 rounded"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 border rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => onSubmit(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}