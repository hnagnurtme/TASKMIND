import React, { useState } from "react";
import { Task } from "@/interface/task";
import { generateAssistantResponse, AssistantRequest } from "@/api/Assitant";

interface AssistantProps {
  tasks: Task[];
}

export const Assistant: React.FC<AssistantProps> = ({ tasks }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const request: AssistantRequest = {
        prompt,
        tasks,
      };

      const result = await generateAssistantResponse(request);
      setResponse(result.text);
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Assistant AI - Quản lý Deadline</h2>
      <textarea
        style={{ width: "100%", minHeight: 100, padding: 8, fontSize: 14 }}
        placeholder="Nhập câu hỏi hoặc yêu cầu gợi ý..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        style={{
          marginTop: 8,
          padding: "8px 16px",
          fontSize: 14,
          cursor: "pointer",
        }}
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Gửi"}
      </button>

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#ffe6e6",
            borderRadius: 8,
            color: "#cc0000",
            border: "1px solid #ffcccc",
          }}
        >
          {error}
        </div>
      )}

      {response && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#f4f4f4",
            borderRadius: 8,
            whiteSpace: "pre-wrap",
          }}
        >
          {response}
        </div>
      )}
    </div>
  );
};
