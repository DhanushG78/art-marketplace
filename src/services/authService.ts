import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserRole } from "@/store/useStore";

// ─── Sign Up ─────────────────────────────────────────────────────────────────

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<{ success: boolean; message: string }> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = credential;

    // Set display name on the Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Persist role + name to Firestore so AuthProvider can read it back
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: "Account created successfully!" };
  } catch (err) {
    const error = err as AuthError;
    const message = firebaseErrorMessage(error.code);
    return { success: false, message };
  }
}

// ─── Sign In ─────────────────────────────────────────────────────────────────

export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged in AuthProvider will pick up the new user automatically
    return { success: true, message: "Login successful!" };
  } catch (err) {
    const error = err as AuthError;
    return { success: false, message: firebaseErrorMessage(error.code) };
  }
}

// ─── Sign Out ────────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  // onAuthStateChanged will fire with null → Zustand setUser(null)
}

// ─── Friendly error messages ─────────────────────────────────────────────────

function firebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "Something went wrong. Please try again.";
  }
}
