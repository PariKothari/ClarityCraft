"use client";
import { ArrowRight } from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import { MessageContext } from "@/context/MessageContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { fetchGeminiResponse } from "@/lib/gemini";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

function Hero() {
  const [problemInput, setProblemInput] = useState("");
  const [stuckInput, setStuckInput] = useState("");
  const { setMessage } = useContext(MessageContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const createUser = useMutation(api.users.createUser);
  const createWorkspace = useMutation(api.workspace.createWorkspace);
  const userDoc = useQuery(
    api.users.getUserByUID,
    userDetail?.uid ? { uid: userDetail.uid } : "skip"
  );
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      if (userDetail?.uid && !userDoc) {
        const userId = await createUser({
          name: userDetail.name,
          email: userDetail.email,
          picture: userDetail.photoURL,
          uid: userDetail.uid,
        });
        setUserDetail((prev) => ({ ...prev, _id: userId }));
      }
    };
    syncUser();
  }, [userDetail, userDoc, createUser, setUserDetail]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserDetail(null);
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const onGenerate = async () => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }

    const userId =
      userDoc?._id ||
      userDetail?._id ||
      userDetail?.uid ||
      null;

    if (!userId) {
      console.error("❌ User ID missing");
      return;
    }

    const combinedInput = `Problem: ${problemInput}\nStuck: ${stuckInput}`;
    const userMsg = { role: "user", content: combinedInput };
    setMessage(userMsg);

    let aiReply = "Sorry, Gemini couldn't respond.";
    try {
      const { reply } = await fetchGeminiResponse(combinedInput);
      if (reply) aiReply = reply;
    } catch (error) {
      console.error("❌ Gemini error:", error);
    }

    const assistantMsg = { role: "assistant", content: aiReply };

    let workspaceId = null;
    try {
      workspaceId = await createWorkspace({
        user: userId,
        messages: [userMsg, assistantMsg],
      });
    } catch (err) {
      console.error("❌ Workspace creation failed:", err);
    }

    if (workspaceId) {
      router.push("/workspace/" + workspaceId);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[93vh] px-4 bg-black text-white">
      {/* 🔐 Sign In / Avatar */}
      <div className="absolute top-6 right-6">
        {!userDetail ? (
          <button
            onClick={() => setOpenDialog(true)}
            className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors"
          >
            Sign In
          </button>
        ) : (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img
                src={userDetail.photoURL}
                alt="avatar"
                className="h-8 w-8 rounded-full border border-gray-600"
              />
              <span className="text-sm text-gray-300">{userDetail.name}</span>
            </div>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#111] text-white rounded-md shadow-md">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-red-600 hover:text-white rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🖤 Heading */}
      <h2 className="font-bold text-4xl text-center mb-2">ClarityCraft</h2>
      <p className="text-gray-400 text-center mb-8">
        Paste a LeetCode problem and tell us where you’re stuck. Get step‑by‑step guidance and visualizations.
      </p>

      {/* 📝 Input Boxes + Centered Action Button */}
      <div className="w-full max-w-3xl bg-[#111] border border-gray-700 rounded-xl p-7 space-y-4">
        <input
          placeholder="Paste LeetCode problem link or topic..."
          value={problemInput}
          onChange={(e) => setProblemInput(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-gray-600 rounded-md px-4 py-3 w-full focus:outline-none"
        />
        <input
          placeholder="Where are you stuck or want full Explanation?(e.g. Step,Approach,Syntax,optimization)"
          value={stuckInput}
          onChange={(e) => setStuckInput(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-gray-600 rounded-md px-5 py-4 w-full focus:outline-none"
        />

        {/* Centered Action Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={onGenerate}
            disabled={!problemInput && !stuckInput}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md transition-transform active:scale-95 disabled:opacity-50"
          >
             Start Revision
          </button>
        </div>
      </div>

      {/* 🧠 Vault Button */}
      <div className="mt-10">
        <button
          onClick={() => router.push("/vault")}
          className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          🔍 View Your Vault
        </button>
      </div>

      {/* 🔐 Sign In Dialog */}
      <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
    </div>
  );
}

export default Hero;