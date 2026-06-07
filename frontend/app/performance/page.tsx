"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface Review {
  id: number;
  employee_id: number;
  rating: number;
  feedback: string;
  reviewed_by: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
}

export default function PerformancePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [selectedEmployee, setSelectedEmployee] =
    useState("");

  const [rating, setRating] = useState(5);

  const [feedback, setFeedback] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchReviews();
    fetchEmployees();
  }, []);

  const fetchReviews = async () => {
    try {
      const response =
        await api.get("/performance/all");

      setReviews(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response =
        await api.get("/employees/");

      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createReview = async () => {
    if (!selectedEmployee) return;

    try {
      await api.post(
        `/performance/review/${selectedEmployee}`,
        {
          rating,
          feedback,
        }
      );

      setFeedback("");
      setRating(5);
      setSelectedEmployee("");

      fetchReviews();

      alert(
        "Review submitted successfully"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredReviews =
    reviews.filter((review) =>
      review.employee_id
        .toString()
        .includes(search)
    );

  if (loading) {
    return (
      <div>
        Loading performance reviews...
      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Performance Management
        </h1>

      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Create Review
        </h2>

        <div className="grid grid-cols-1 gap-4">

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

          <select
            value={rating}
            onChange={(e) =>
              setRating(
                Number(e.target.value)
              )
            }
            className="border p-2 rounded"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>

          <textarea
            placeholder="Feedback"
            value={feedback}
            onChange={(e) =>
              setFeedback(
                e.target.value
              )
            }
            className="border p-2 rounded h-32"
          />

          <button
            onClick={createReview}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Review
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
                Rating
              </th>

              <th className="p-4 text-left">
                Feedback
              </th>

              <th className="p-4 text-left">
                Reviewed By
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredReviews.map(
              (review) => (
                <tr
                  key={review.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {review.id}
                  </td>

                  <td className="p-4">
                    {review.employee_id}
                  </td>

                  <td className="p-4">
                    ⭐ {review.rating}
                  </td>

                  <td className="p-4">
                    {review.feedback}
                  </td>

                  <td className="p-4">
                    {review.reviewed_by}
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