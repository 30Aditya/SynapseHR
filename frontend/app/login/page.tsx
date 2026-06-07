"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Attempting login...");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (!response.data.access_token) {
        throw new Error("No access token received");
      }

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      console.log(
        "Stored token:",
        localStorage.getItem("token")
      );

      alert("Login successful");

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response) {
        console.log("Response:", err.response.data);
      }

      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">

      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          SynapseHR Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>

    </div>
  );
}