import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: "cryptothing" },
});

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const { userId, firstName, lastName, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 0) If the user already exists, do nothing
    const { data: existing, error: fetchError } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // some unexpected error fetching
      console.error("Error checking for existing user:", fetchError);
      return NextResponse.json(
        { message: "Error checking user existence", error: fetchError },
        { status: 500 }
      );
    }

    if (existing) {
      // user already in DB → no-op
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    }

    const registrationDate = new Date().toISOString();

    // 1) Insert into cryptothing.users
    const { error: userInsertError } = await supabase.from("users").insert({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      emailaddress: email,
      registrationdate: registrationDate,
    });

    if (userInsertError) {
      console.error("Error inserting user:", userInsertError);
      return NextResponse.json(
        { message: "Error inserting user", error: userInsertError },
        { status: 500 }
      );
    }

    // 2) Insert into cryptothing.current_portfolio
    const { error: portfolioInsertError } = await supabase
      .from("current_portfolio")
      .insert({ user_id: userId });

    if (portfolioInsertError) {
      console.error("Error inserting portfolio:", portfolioInsertError);
      return NextResponse.json(
        { message: "Error inserting portfolio", error: portfolioInsertError },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User added successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
