"use client";
import Chatview from "@/components/custom/Chatview";
import Codeview from "@/components/custom/Codeview";
import React from "react";
import { useParams } from "next/navigation";
import Hero from "@/components/custom/Hero";

function Workspace() {
  const { id } = useParams();

  return (
    <div className="p-2">
      <div className="w-full">
        {/* Pass workspace ID to both views */}
        <Chatview workspaceId={id} />
        
      </div>
    </div>
  );
}

export default Workspace;