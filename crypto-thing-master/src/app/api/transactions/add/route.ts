import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request, res: Response) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const requestData = await req.json();

  const { type, coin, quantity, pricePerCoin, dateTime, total } = requestData;

  if (!coin || !quantity || !pricePerCoin || !dateTime) {
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

    // Extract userId from the query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    // Find the portfolio ID using the user ID
    const portfolioQuery = `
      SELECT Portfolio_ID FROM Current_Portfolio WHERE User_ID = ?;
    `;
    const [portfolioResult]: any = await db.execute(portfolioQuery, [userId]);
    const portfolioId = portfolioResult[0].Portfolio_ID;

    // Insert the transaction into the Transaction_History table
    const transactionQuery = `
      INSERT INTO Transaction_History (Transaction_Type, Coin_ID, Portfolio_ID, Date, Amount, Value, Price_per_Coin)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const date = new Date(dateTime)
      .toISOString()
      .replace("T", " ")
      .replace("Z", "");
    const amount = type === "Buy" ? quantity : -quantity;
    const value = type === "Buy" ? total : -total;
    const transactionValues = [
      type,
      coin,
      portfolioId,
      date,
      amount,
      value,
      pricePerCoin,
    ];

    const [transactionResult] = await db.execute(
      transactionQuery,
      transactionValues
    );

    db.end();

    return NextResponse.json(
      { message: "Transaction added successfully", result: transactionResult },
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
