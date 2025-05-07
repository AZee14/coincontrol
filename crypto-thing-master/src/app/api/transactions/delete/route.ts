import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function DELETE(req: Request, res: Response) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
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

    // Extract transactionId from the query parameters
    const url = new URL(req.url);
    const transactionId = url.searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        { error: "transactionId parameter is required" },
        { status: 400 }
      );
    }

    // Delete that transaction from the database. Remember that you will also have to update everything else when that transaction gets deleted like the portfolio and stuff. A lot of things will be updated. Handle this carefully
    const query = `
    DELETE FROM Transaction_History
    WHERE Transaction_ID = ?
  `;

    const values = [transactionId];

    const [result] = await db.execute(query, values);

    db.end();

    return NextResponse.json(
      { message: "Transaction deleted successfully", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
