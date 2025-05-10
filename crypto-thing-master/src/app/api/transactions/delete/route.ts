import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(req: Request) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  // Extract transactionId from the URL query
  const url = new URL(req.url);
  const transactionId = url.searchParams.get("transactionId");

  if (!transactionId) {
    return NextResponse.json(
      { error: "transactionId parameter is required" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "cryptothing" },
    }
  );

  try {
    // Delete the transaction
    const { data, error } = await supabase
      .from("transaction_history")
      .delete()
      .eq("transaction_id", transactionId);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Transaction deleted successfully", result: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
