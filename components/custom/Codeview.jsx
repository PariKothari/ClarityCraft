"use client";
import React, { useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import lookup from "@/data/lookup";

function Codeview() {
  const [activeTab, setActiveTab] = useState("code");
  const [files,setFiles]=useState(lookup?.DEFAULT_FILE)
  return (
    <div className="h-screen bg-[#0f0f0f] text-white">
      {/* Top header section */}
      <div className="bg-[#121212] w-full p-2 border-b border-gray-700">
        <div className="flex items-center gap-4 px-2">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${
              activeTab === "code"
                ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
                : "text-white"
            }`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${
              activeTab === "preview"
                ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
                : "text-white"
            }`}
          >
            Preview
          </h2>
        </div>
      </div>

      {/* Sandpack layout */}
      <SandpackProvider
      files={files}
      template="react" theme="dark"
      customSetup={{
        dependencies:{
          ...lookup.DEPENDANCY
        }
      }}
      options ={{
        externalResources:['https://cdn.tailwindcss.com']
      }}>
        <SandpackLayout>
          <SandpackFileExplorer style={{ height: "90vh" }} />
          {activeTab === "code" ? (
            <SandpackCodeEditor style={{ height: "90vh" }} />
          ) : (
            <SandpackPreview style={{ height: "90vh" }} showNavigator={true} />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default Codeview;