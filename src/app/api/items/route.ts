import { NextResponse } from "next/server";
import {
  getItemsFromFirestore,
  addItemToFirestore,
  updateItemInFirestore,
  deleteItemFromFirestore,
} from "@/services/firestoreService";

/**
 * GET /api/items
 * Fetch all artworks from Firestore (falls back to mock store if empty).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() ?? "";

    let items = await getItemsFromFirestore();

    if (search) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          (item.description ?? "").toLowerCase().includes(search)
      );
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("[GET /api/items]", error);
    return NextResponse.json({ error: "Failed to fetch artworks." }, { status: 500 });
  }
}

/**
 * POST /api/items
 * Create a new artwork stored in Firestore.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = await addItemToFirestore(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("[POST /api/items]", error);
    return NextResponse.json({ error: "Failed to create artwork." }, { status: 500 });
  }
}

/**
 * PUT /api/items
 * Update an existing artwork in Firestore by ID (sent in body).
 */
export async function PUT(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

    await updateItemInFirestore(id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/items]", error);
    return NextResponse.json({ error: "Failed to update artwork." }, { status: 500 });
  }
}

/**
 * DELETE /api/items
 * Delete an artwork from Firestore by ID (sent in body).
 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

    await deleteItemFromFirestore(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/items]", error);
    return NextResponse.json({ error: "Failed to delete artwork." }, { status: 500 });
  }
}
