"use client";
import React, { createContext, useState } from "react";

// Create the context
export const MessageContext = createContext();

// Create the provider
export const MessageProvider = ({ children }) => {
  const [messages, setMessage] = useState([]);

  return (
    <MessageContext.Provider value={{ messages, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};