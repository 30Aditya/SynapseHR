"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/services/api";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function InterviewPage() {
  const [candidateName, setCandidateName] =
    useState("");

  const [jobTitle, setJobTitle] =
    useState("");

  const [resumeFile, setResumeFile] =
    useState<File | null>(null);

  const [sessionId, setSessionId] =
    useState<number | null>(null);

  const [question, setQuestion] =
    useState("");

  const [evaluation, setEvaluation] =
    useState("");

  const [interviewStarted, setInterviewStarted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [listening, setListening] =
    useState(false);

  const recognitionRef = useRef<any>(null);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(
      utterance
    );
  };

  useEffect(() => {
    if (!question) return;

    speak(question);
  }, [question]);

  const startInterview = async () => {
    try {
      if (!candidateName.trim()) {
        alert("Enter candidate name");
        return;
      }

      if (!jobTitle.trim()) {
        alert("Enter job title");
        return;
      }

      if (!resumeFile) {
        alert("Upload a resume PDF");
        return;
      }

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "candidate_name",
        candidateName
      );

      formData.append(
        "job_title",
        jobTitle
      );

      formData.append(
        "resume",
        resumeFile
      );

      const response =
        await api.post(
          "/interview/start",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      setSessionId(
        response.data.session_id
      );

      setQuestion(
        response.data.question
      );

      setInterviewStarted(true);
    } catch (error) {
      console.error(error);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (
    answer: string
  ) => {
    if (!sessionId) return;

    try {
      const response =
        await api.post(
          `/interview/respond/${sessionId}`,
          {
            answer,
          }
        );

      if (response.data.question) {
        setQuestion(
          response.data.question
        );
      }

      if (response.data.message) {
        setQuestion(
          response.data.message
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition not supported in this browser. Use Chrome."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognitionRef.current =
      recognition;

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults =
      false;

    setListening(true);

    recognition.start();

    recognition.onresult = async (
      event: any
    ) => {
      const transcript =
        event.results[0][0].transcript;

      setListening(false);

      await submitAnswer(
        transcript
      );
    };

    recognition.onerror = (
      error: any
    ) => {
      console.error(error);

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const finishInterview = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);

      const response =
        await api.post(
          `/interview/end/${sessionId}`
        );

      setEvaluation(
        response.data.evaluation
      );

      speak(
        "Interview completed. Evaluation generated."
      );
    } catch (error) {
      console.error(error);
      alert(
        "Failed to generate evaluation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        AI Voice Interview
      </h1>

      {!interviewStarted && (

        <div className="bg-white rounded-lg shadow p-6">

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

            <input
              type="text"
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) =>
                setJobTitle(
                  e.target.value
                )
              }
              className="border p-3 rounded"
            />

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setResumeFile(
                  e.target.files?.[0] || null
                )
              }
              className="border p-3 rounded"
            />

            <button
              onClick={startInterview}
              disabled={loading}
              className="bg-blue-600 text-white p-3 rounded"
            >
              {loading
                ? "Starting..."
                : "Start Interview"}
            </button>

          </div>

        </div>

      )}

      {interviewStarted && (

        <div className="space-y-6">

          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              AI Question
            </h2>

            <p className="text-lg">
              {question}
            </p>

          </div>

          <div className="bg-white rounded-lg shadow p-6">

            <button
              onClick={startRecording}
              disabled={listening}
              className="bg-green-600 text-white px-6 py-3 rounded"
            >
              {listening
                ? "🎙 Listening..."
                : "🎤 Answer by Voice"}
            </button>

            <button
              onClick={finishInterview}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded ml-4"
            >
              Finish Interview
            </button>

          </div>

          {evaluation && (

            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-2xl font-bold mb-4">
                AI Evaluation
              </h2>

              <pre className="whitespace-pre-wrap">
                {evaluation}
              </pre>

            </div>

          )}

        </div>

      )}

    </div>
  );
}