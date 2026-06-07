"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";

interface Candidate {
  id: number;
  candidate_name: string;
  score: number;
  recommendation: string;
  resume_text: string;
  job_description: string;
}

export default function CandidateRankingPage() {
  const [candidates, setCandidates] =
    useState<Candidate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response =
        await api.get("/ai/candidates");

      setCandidates(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates =
    useMemo(() => {
      return candidates.filter(
        (candidate) =>
          candidate.candidate_name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [candidates, search]);

  const topCandidate =
    filteredCandidates.length > 0
      ? filteredCandidates[0]
      : null;

  if (loading) {
    return (
      <div className="text-xl">
        Loading candidates...
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        AI Candidate Ranking
      </h1>

      {topCandidate && (

        <div className="bg-white rounded-lg shadow p-6 mb-6">

          <h2 className="text-xl font-bold mb-2">
            🏆 Top Candidate
          </h2>

          <p className="text-2xl font-semibold">
            {topCandidate.candidate_name}
          </p>

          <p className="mt-2">
            Score:{" "}
            <strong>
              {topCandidate.score}
            </strong>
          </p>

          <p>
            Recommendation:{" "}
            <strong>
              {
                topCandidate.recommendation
              }
            </strong>
          </p>

        </div>

      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">

        <input
          type="text"
          placeholder="Search Candidate"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border p-3 rounded w-full"
        />

      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Rank
              </th>

              <th className="p-4 text-left">
                Candidate
              </th>

              <th className="p-4 text-left">
                Resume Score
              </th>

              <th className="p-4 text-left">
                Recommendation
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredCandidates.map(
              (
                candidate,
                index
              ) => (
                <tr
                  key={candidate.id}
                  className="border-t"
                >

                  <td className="p-4 font-bold">
                    #{index + 1}
                  </td>

                  <td className="p-4">
                    {
                      candidate.candidate_name
                    }
                  </td>

                  <td className="p-4">
                    {candidate.score}
                  </td>

                  <td className="p-4">
                    {
                      candidate.recommendation
                    }
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