"use client";
import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Lookup from "@/data/lookup";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function SignInDialog({ openDialog, closeDialog }) {
  const { setUserDetail } = useContext(UserDetailContext);
  const createUser = useMutation(api.users.createUser); //  lowercase

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setUserDetail({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });

      await createUser({
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
        uid: user.uid,
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Sign In</DialogTitle>
          </VisuallyHidden>

          <div className="flex flex-col justify-center gap-3">
            <h2 className="font-bold text-2xl text-center text-white">
              {Lookup.SIGNIN_HEADING}
            </h2>

            <DialogDescription className="mt-2 text-center">
              {Lookup.SIGNIN_SUBHEADING}
            </DialogDescription>

            <button
              className="bg-blue-500 text-white hover:bg-blue-300 mt-3 px-4 py-2 rounded-md"
              onClick={loginWithGoogle}
            >
              Sign In with Google
            </button>

            <p className="text-xs text-gray-400 text-center">
              {Lookup?.SIGNIn_AGREEMENT_TEXT}
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;