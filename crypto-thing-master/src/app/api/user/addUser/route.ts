import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: 'cryptothing' } });


export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    const requestData = await req.json();
    const { userId, firstName, lastName, email } = requestData;

    if (!userId || !email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const registrationDate = new Date().toISOString();

    // Insert into cryptothing.users
    const { error: userInsertError } = await supabase
      .from("users")
      .insert([
        {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          emailaddress: email,
          registrationdate: registrationDate,
        },
      ]);

    if (userInsertError) {
      console.error("Error inserting into Users:", userInsertError);
      return NextResponse.json({ message: "Error inserting user", error: userInsertError }, { status: 500 });
    }

    // Insert into cryptothing.current_portfolio
    const { error: portfolioInsertError } = await supabase
      .from("current_portfolio")
      .insert([
        {
          user_id: userId,
        },
      ]);

    if (portfolioInsertError) {
      console.error("Error inserting into Current_Portfolio:", portfolioInsertError);
      return NextResponse.json({ message: "Error inserting portfolio", error: portfolioInsertError }, { status: 500 });
    }

    return NextResponse.json({ message: "User added successfully" }, { status: 201 });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
  }
}
