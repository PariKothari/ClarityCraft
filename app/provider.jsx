"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { MessageProvider } from "@/context/MessageContext";
import { UserDetailContext } from "@/context/UserDetailContext"; // ✅ now imported from separate file

export default function Provider({ children }) {
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDetail({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        });
      } else {
        setUserDetail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <MessageProvider>{children}</MessageProvider>
    </UserDetailContext.Provider>
  );
}