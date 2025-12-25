"use client";
import React, { useEffect, useContext, useState } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { MessageContext } from "@/context/MessageContext";
import { fetchGeminiResponse } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";

function Chatview({ workspaceId }) {
  const { id } = useParams();
  const convex = useConvex();
  const user = auth.currentUser;

  const { messages, setMessage } = useContext(MessageContext);
  const [workspaceData, setWorkspaceData] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Metadata (LeetCode Revision)
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [clarityTag, setClarityTag] = useState("");
  const [link, setLink] = useState("");
  const [pattern, setPattern] = useState("");

  // Modal
  const [showMetadata, setShowMetadata] = useState(false);

  useEffect(() => {
    if (workspaceId || id) {
      fetchWorkspace();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, id]);

  const fetchWorkspace = async () => {
    try {
      const result = await convex.query(api.workspace.getWorkspace, {
        workspaceId: workspaceId || id,
      });
      setWorkspaceData(result);
      if (Array.isArray(result?.messages)) {
        setMessage([...result.messages]);
      }
    } catch (error) {
      console.error(" Failed to fetch workspace:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessage((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      let prompt = input;

      // Only enforce structure if it's a full explanation request
      if (
        input.toLowerCase().includes("explain") ||
        input.toLowerCase().includes("leetcode") ||
        input.toLowerCase().includes("problem")
      ) {
        prompt = `
Please answer in the following structured format:

## Problem Restatement
## Approach
## Steps
## Code
## Pitfalls

Question: ${input}
        `.trim();
      }

      const { reply } = await fetchGeminiResponse(prompt);

      const aiMessage = {
        role: "assistant",
        content: reply || "Sorry, Gemini couldn't respond.",
      };
      setMessage((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(" Gemini error:", error);
      setMessage((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, Gemini couldn't respond." },
      ]);
    } finally {
      setLoading(false);
    }
  };
    const handleSave = async () => {
    if (!user || !Array.isArray(messages)) return;

    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistantMsg) return;

    try {
      await addDoc(collection(db, "vault"), {
        userId: user.uid,
        explanation: lastAssistantMsg.content,
        createdAt: serverTimestamp(),
        mode: "LeetCode Revision",
        title,
        topic,
        difficulty,
        clarityTag,
        link,
        patternOrTrick: pattern,
      });
      alert("Saved to Vault!");
      setShowMetadata(false);
    } catch (err) {
      console.error(" Save failed:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white p-6">
      <h2 className="text-xl font-semibold mb-4">ChatView</h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`w-full max-w-5xl mx-auto px-6 py-4 rounded-xl text-lg leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#555553] self-start text-white font-serif"
                  : "bg-[rgb(54,54,54)] self-end text-gray-200 font-sans shadow-lg"
              }`}
            >
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ node, ...props }) => (
                      <h2 className="text-xl font-bold text-blue-400 mt-4 mb-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-lg font-semibold text-blue-300 mt-3 mb-2" {...props} />
                    ),
                    // Do NOT override <p> to avoid <pre> inside <p>
                    code: ({ node, inline, children, ...props }) => {
                      // Inline code styling only
                      if (inline) {
                        return (
                          <code
                            className="bg-[#1f1f1f] text-green-400 px-2 py-0.5 rounded"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      // For block code, let ReactMarkdown render <pre><code> and style via <pre> below
                      return <code {...props}>{children}</code>;
                    },
                    pre: ({ node, children, ...props }) => (
                      <pre className="bg-[#1f1f1f] text-green-300 p-4 rounded-md overflow-x-auto" {...props}>
                        {children}
                      </pre>
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside text-gray-200 mb-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside text-gray-200 mb-2" {...props} />
                    ),
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    a: ({ node, ...props }) => (
                      <a
                        className="text-blue-400 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No messages yet.</p>
        )}
        {loading && <div className="text-white-xl italic">Thinking...</div>}
      </div>

      {/* Input + Save */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-[#222121] text-white border border-gray-700 rounded-md px-5 py-3 text-lg focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md text-base transition-transform active:scale-95 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {Array.isArray(messages) && messages.some((m) => m.role === "assistant") && (
          <button
            onClick={() => setShowMetadata(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-md text-base transition-transform active:scale-95 cursor-pointer"
          >
            Save
          </button>
        )}
      </div>

      {/* Metadata Modal */}
      {showMetadata && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Save to Vault</h3>
            <p className="text-gray-300 mb-6">
              This entry will be saved under{" "}
              <span className="font-semibold text-purple-300">LeetCode Revision</span>.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="🧠 Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-md px-3 py-2"
              />
              <input
                type="text"
                placeholder="📚 Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-md px-3 py-2"
              />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-md px-3 py-2"
              >
                <option value="">⚙️ Difficulty</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <select
                value={clarityTag}
                onChange={(e) => setClarityTag(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-md px-3 py-2"
              >
                <option value="">🧼 Clarity</option>
                <option>Clear</option>
                <option>Revisit</option>
                <option>Confused</option>
                <option>Didn’t Understand</option>
              </select>
              <input
                type="text"
                placeholder="🔗 Problem Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-md px-3 py-2"
              />
              <input
                type="text"
                placeholder="🧠 Pattern / Trick (optional)"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-md px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowMetadata(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatview;