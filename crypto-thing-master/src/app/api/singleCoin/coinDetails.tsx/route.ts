import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
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
  const coinId = url.searchParams.get("coinId");

  try {
    if (!userId || !coinId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // A query to get name, shorthand notation of the coin and it's amount, value in dollars, avg. buy price, total profit/loss amount and percentage wrt to that user
    // Loss should be denoted by minus sign in both attributes
     // ? in the query prevents sql injection attacks. The ? will be replaced by the value in the values array
    const query = `SELECT 
    c.Coin_Name AS name,
    c.Symbol AS shorthand_notation,
    a.Amount AS amount,
    a.Value AS value_in_dollars,
    a.AvgBuyPrice AS avg_buy_price,
    a.Profit_Loss AS total_profit_loss_amount,
    ROUND((a.Profit_Loss / (a.Amount * a.AvgBuyPrice)) * 100, 2) AS total_profit_loss_percentage
FROM 
    Users u
JOIN 
    Current_Portfolio cp ON u.User_ID = cp.User_ID
JOIN 
    Assets a ON cp.Portfolio_ID = a.Portfolio_ID
JOIN 
    Coins c ON a.Coin_ID = c.Coin_ID
WHERE 
    u.User_ID = ? AND c.Coin_ID = ?`;


    const values = [userId, coinId];
    const [data] = await db.execute(query, values);
    db.end();

    return NextResponse.json({ results: data });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
