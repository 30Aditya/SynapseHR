"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          SynapseHR
        </h1>
      </div>

      <nav className="p-4 space-y-2">

        <Link
          href="/dashboard"
          className="block p-3 rounded hover:bg-slate-800"
        >
          Dashboard
        </Link>

        <Link
          href="/employees"
          className="block p-3 rounded hover:bg-slate-800"
        >
          Employees
        </Link>

        <Link
          href="/attendance"
          className="block p-3 rounded hover:bg-slate-800"
        >
          Attendance
        </Link>

        <Link
          href="/leave"
          className="block p-3 rounded hover:bg-slate-800"
        >
          Leave
        </Link>

        <Link
          href="/payroll"
          className="block p-3 rounded hover:bg-slate-800"
        >
          Payroll
        </Link>

        <Link
          href="/performance"
          className="block p-3 rounded hover:bg-slate-800"
        >
          Performance
        </Link>

        <div className="pt-4 text-xs text-slate-400 uppercase">
          AI Modules
        </div>

        <Link
          href="/resume-screening"
          className="block p-3 rounded hover:bg-slate-800"
        >
          Resume Screening
        </Link>

        <Link
          href="/interview"
          className="block p-3 rounded hover:bg-slate-800"
        >
          Interview Evaluation
        </Link>

        <Link
          href="/candidate-ranking"
          className="block p-3 rounded hover:bg-slate-800"
        >
          Candidate Ranking
        </Link>

        <Link
          href="/attrition"
          className="block p-3 rounded hover:bg-slate-800"
        >
          Attrition Prediction
        </Link>

      </nav>
    </aside>
  );
}