import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { timeStamp } from "console";

export async function POST(req: Request, res: Response) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const requestData = await req.json();

  const { userId, firstName, lastName, email } = requestData;

  if (!userId || !email) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_MYSQL_HOST,
      port: parseInt(process.env.NEXT_PUBLIC_MYSQL_PORT as string),
      database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
      user: process.env.NEXT_PUBLIC_MYSQL_USER,
      password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
    });

    // add lastlogin and registration date
    const query = `
      INSERT INTO Users (User_ID, First_Name, Last_Name, EmailAddress, RegistrationDate)
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = [userId, firstName, lastName, email, (new Date()).toISOString()];

    const secondQuery = `
    INSERT INTO Current_Portfolio (USER_ID) VALUES (?);

    `;
    const secondValues = [userId];

    const [result] = await db.execute(query, values);
    const [secondResult] = await db.execute(secondQuery, secondValues);

    db.end();

    return NextResponse.json(
      { message: "User added successfully", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
