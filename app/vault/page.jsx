"use client";
import { useRouter } from "next/navigation";

export default function VaultHome() {
  const router = useRouter();

  const vaultModes = [
    { label: " LeetCode Revision", path: "/vault/leetcode" },
  ];

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col items-center justify-center px-6 py-12">
      {/* Heading */}
      <h2 className="text-4xl font-bold mb-42 mt-0 text-blue-400 text-center">
        Your Vault
      </h2>

      {/* Centered Single Box */}
      <div className="w-full max-w-lg">
        {vaultModes.map((mode) => (
          <button
            key={mode.path}
            onClick={() => router.push(mode.path)}
            className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-10 py-8 rounded-2xl shadow-xl text-2xl font-semibold transition-transform transform hover:scale-105 active:scale-95 cursor-pointer border border-gray-700"
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}