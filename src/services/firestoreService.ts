import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Artwork } from "@/types/artwork";
import { useArtworkStore } from "@/store/useArtworkStore";

const COLLECTION = "artworks";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert Firestore doc → Artwork, mapping the doc ID and Timestamp fields */
function docToArtwork(id: string, data: Record<string, any>): Artwork {
  return {
    ...data,
    id,
    // Firestore serverTimestamp comes back as a Timestamp object
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt ?? new Date().toISOString(),
  } as Artwork;
}

// ─── Firestore CRUD ───────────────────────────────────────────────────────────

/**
 * Fetch all artworks from Firestore, ordered newest-first.
 * Falls back to the Zustand mock store if Firestore is unreachable.
 */
export async function getItemsFromFirestore(): Promise<Artwork[]> {
  try {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      // No data in Firestore yet — return the seeded mock items
      return useArtworkStore.getState().artworks;
    }

    return snap.docs.map((d) => docToArtwork(d.id, d.data()));
  } catch {
    // Offline / rules not set — use mock store so the UI never breaks
    return useArtworkStore.getState().artworks;
  }
}

/**
 * Add a new artwork to Firestore.
 * Firestore auto-generates the document ID, which is mapped back.
 */
export async function addItemToFirestore(
  data: Omit<Artwork, "id" | "createdAt">
): Promise<Artwork> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });

  // Read back to get the server timestamp resolved
  return docToArtwork(ref.id, {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

/**
 * Update an existing artwork by Firestore document ID.
 */
export async function updateItemInFirestore(
  id: string,
  updates: Partial<Omit<Artwork, "id">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), updates);
}

/**
 * Delete an artwork by Firestore document ID.
 */
export async function deleteItemFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
