"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface Job {
  id: number;
  job_title: string;
}

interface ScreeningResult {
  job_title: string;
  score: number;
  recommendation: string;
  missing_skills: string[];
}

export default function ResumeScreeningPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const [candidateName, setCandidateName] =
    useState("");

  const [selectedJob, setSelectedJob] =
    useState("");

  const [resume, setResume] =
    useState<File | null>(null);

  const [result, setResult] =
    useState<ScreeningResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response =
        await api.get("/jobs/");

      setJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const analyzeResume = async () => {
    if (
      !candidateName ||
      !selectedJob ||
      !resume
    ) {
      alert(
        "Enter candidate name, select a job and upload a resume"
      );
      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "candidate_name",
        candidateName
      );

      formData.append(
        "resume",
        resume
      );

      const response =
        await api.post(
          `/ai/screen-resume/${selectedJob}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Screening failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        AI Resume Screening
      </h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">

        <div className="grid gap-4">

          <input
            type="text"
            placeholder="Candidate Name"
            value={candidateName}
            onChange={(e) =>
              setCandidateName(
                e.target.value
              )
            }
            className="border p-3 rounded"
          />

          <select
            value={selectedJob}
            onChange={(e) =>
              setSelectedJob(
                e.target.value
              )
            }
            className="border p-3 rounded"
          >
            <option value="">
              Select Job Opening
            </option>

            {jobs.map((job) => (
              <option
                key={job.id}
                value={job.id}
              >
                {job.job_title}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setResume(
                e.target.files?.[0] || null
              )
            }
            className="border p-3 rounded"
          />

          <button
            onClick={analyzeResume}
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded"
          >
            {loading
              ? "Analyzing..."
              : "Analyze Resume"}
          </button>

        </div>

      </div>

      {result && (
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-lg font-semibold mb-2">
              Match Score
            </h2>

            <p className="text-5xl font-bold">
              {result.score}%
            </p>

          </div>

          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-lg font-semibold mb-2">
              Recommendation
            </h2>

            <p className="text-xl">
              {result.recommendation}
            </p>

          </div>

          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-lg font-semibold mb-2">
              Missing Skills
            </h2>

            <ul className="list-disc pl-5">

              {result.missing_skills.map(
                (skill, index) => (
                  <li key={index}>
                    {skill}
                  </li>
                )
              )}

            </ul>

          </div>

        </div>
      )}

    </div>
  );
}