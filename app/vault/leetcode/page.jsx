"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";

export default function LeetCodeVault() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterClarity, setFilterClarity] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const user = auth.currentUser;

  useEffect(() => {
    const fetchVault = async () => {
      if (!user) return;
      const q = query(
        collection(db, "vault"),
        where("userId", "==", user.uid),
        where("mode", "==", "LeetCode Revision") // ensure it matches Chatview save
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setEntries(data);
    };

    fetchVault();
  }, [user]);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      (entry.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (entry.topic?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (entry.explanation?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesTopic = filterTopic ? entry.topic === filterTopic : true;
    const matchesDifficulty = filterDifficulty ? entry.difficulty === filterDifficulty : true;
    const matchesClarity = filterClarity ? entry.clarityTag === filterClarity : true;

    return matchesSearch && matchesTopic && matchesDifficulty && matchesClarity;
  });

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">🧠 LeetCode Vault</h2>

      {/* 🔍 Search + Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-gray-700 rounded-md px-4 py-2 w-64"
        />
        <select
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-gray-700 rounded-md px-4 py-2"
        >
          <option value="">📚 Topic</option>
          <option>Arrays</option>
          <option>Strings</option>
          <option>LinkedList</option>
          <option>Stacks</option>
          <option>Queue</option>
          <option>Trees</option>
          <option>Graph</option>
          <option>Dp</option>
          <option>Recursion</option>
        </select>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-gray-700 rounded-md px-4 py-2"
        >
          <option value="">⚙️ Difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select
          value={filterClarity}
          onChange={(e) => setFilterClarity(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-gray-700 rounded-md px-4 py-2"
        >
          <option value="">🧼 Clarity</option>
          <option>Clear</option>
          <option>Revisit</option>
          <option>Confused</option>
          <option>Didn’t Understand</option>
        </select>
      </div>

      {/* 📋 Table */}
      {filteredEntries.length === 0 ? (
        <p className="text-gray-400">No saved problems yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700 text-sm">
            <thead className="bg-[#2a2a2a] text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">📚 Topic</th>
                <th className="px-4 py-2 text-left">🧠 Title</th>
                <th className="px-4 py-2 text-left">⚙️ Difficulty</th>
                <th className="px-4 py-2 text-left">🧩 Clarity</th>
                <th className="px-4 py-2 text-left">🔗 Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="hover:bg-[#333] cursor-pointer transition"
                >
                  <td className="px-4 py-2">{entry.topic || "-"}</td>
                  <td className="px-4 py-2">{entry.title || "-"}</td>
                  <td className="px-4 py-2">{entry.difficulty || "-"}</td>
                  <td className="px-4 py-2">{entry.clarityTag || "-"}</td>
                  <td className="px-4 py-2">
                    {entry.link ? (
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                      >
                        Link to Problem
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🧠 Expanded View */}
      {selectedEntry && (
        <div className="mt-8 bg-[#2a2a2a] p-6 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-yellow-400">
            {selectedEntry.title || "Untitled Problem"}
          </h3>
          <p className="text-sm text-gray-400 mb-2">
            Saved on:{" "}
            {selectedEntry.createdAt && typeof selectedEntry.createdAt.toDate === "function"
              ? selectedEntry.createdAt.toDate().toLocaleString()
              : "Unknown"}
          </p>
          <div className="prose prose-invert max-w-none mb-4">
            <ReactMarkdown>{selectedEntry.explanation || ""}</ReactMarkdown>
          </div>
          {selectedEntry.patternOrTrick && (
            <p className="text-sm text-gray-300">
              🧠 Pattern/Trick: {selectedEntry.patternOrTrick}
            </p>
          )}
          {selectedEntry.link && (
            <p className="text-sm text-blue-400 underline mb-2">
              🔗{" "}
              <a
                href={selectedEntry.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedEntry.link}
              </a>
            </p>
          )}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                setEditData(selectedEntry);
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={async () => {
                const confirmDelete = window.confirm("Delete this entry?");
                if (confirmDelete) {
                  await deleteDoc(doc(db, "vault", selectedEntry.id));
                  setEntries((prev) => prev.filter((e) => e.id !== selectedEntry.id));
                  setSelectedEntry(null);
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedEntry(null)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
            {/* 📝 Edit Modal */}
      {isEditing && (
        <>
          {/* Dimmed backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[999]"></div>

          {/* Centered modal */}
          <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            <div className="bg-[#2a2a2a] p-6 rounded-md shadow-md w-full max-w-xl mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">📝 Edit Entry</h3>
              <div className="space-y-4">
                {/* Topic */}
                <input
                  type="text"
                  value={editData.topic || ""}
                  onChange={(e) => setEditData({ ...editData, topic: e.target.value })}
                  placeholder="Topic"
                  className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md px-4 py-2 cursor-pointer"
                />

                {/* Title */}
                <input
                  type="text"
                  value={editData.title || ""}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  placeholder="Title"
                  className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md px-4 py-2 cursor-pointer"
                />

                {/* Link */}
                <input
                  type="text"
                  value={editData.link || ""}
                  onChange={(e) => setEditData({ ...editData, link: e.target.value })}
                  placeholder="LeetCode Link"
                  className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md px-4 py-2 cursor-pointer"
                />

                {/* Pattern/Trick */}
                <input
                  type="text"
                  value={editData.patternOrTrick || ""}
                  onChange={(e) => setEditData({ ...editData, patternOrTrick: e.target.value })}
                  placeholder="Pattern or Trick (optional)"
                  className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md px-4 py-2 cursor-pointer"
                />

                {/* Clarity Tag */}
                <select
                  value={editData.clarityTag || ""}
                  onChange={(e) => setEditData({ ...editData, clarityTag: e.target.value })}
                  className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md px-4 py-2"
                >
                  <option value="">Select clarity tag</option>
                  <option value="Clear">Clear</option>
                  <option value="Revisit">Revisit</option>
                  <option value="Confused">Confused</option>
                  <option value="Didn’t Understand">Didn’t Understand</option>
                </select>

                {/* Explanation */}
                <textarea
                  value={editData.explanation || ""}
                  onChange={(e) => setEditData({ ...editData, explanation: e.target.value })}
                  placeholder="Explanation"
                  rows={6}
                  className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md px-4 py-2"
                />

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={async () => {
                      await updateDoc(doc(db, "vault", editData.id), {
                        title: editData.title || "",
                        topic: editData.topic || "",
                        link: editData.link || "",
                        patternOrTrick: editData.patternOrTrick || "",
                        clarityTag: editData.clarityTag || "",
                        explanation: editData.explanation || "",
                        difficulty: editData.difficulty || "",
                      });
                      setEntries((prev) =>
                        prev.map((e) => (e.id === editData.id ? { ...e, ...editData } : e))
                      );
                      setIsEditing(false);
                      setSelectedEntry({ ...selectedEntry, ...editData });
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}