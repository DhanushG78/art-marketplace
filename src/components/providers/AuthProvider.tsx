"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useStore } from "@/store/useStore";

/**
 * AuthProvider
 * Mounts once inside RootLayout.
 * Listens to Firebase Auth state changes, fetches the user's role
 * from Firestore /users/{uid}, then syncs everything into Zustand.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      // Fetch role from Firestore
      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        const role = snap.exists() ? snap.data().role ?? "buyer" : "buyer";

        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email ?? "",
          role,
        });
      } catch {
        // If Firestore read fails, default to buyer
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email ?? "",
          role: "buyer",
        });
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
