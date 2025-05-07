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
  const userId = url.searchParams.get('userId');
  try {

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter is required' }, { status: 400 });
    }

    // A query to get the coin name in which this user had most lost, loss amount and percentage of loss in that coin wrt to the investment in that coin
    // Loss should be denoted by minus sign in both attributes 
    const query = `SELECT 
    c.Coin_Name,
    a.Coin_ID,
    (a.Amount * (a.AvgBuyPrice - c.MarketPrice)) AS LossAmount,
    ((a.Amount * (a.AvgBuyPrice - c.MarketPrice)) / (a.Amount * a.AvgBuyPrice)) * 100 AS LossPercentage
FROM 
    Users u
    JOIN Current_Portfolio cp ON u.User_ID = cp.User_ID
    JOIN Assets a ON cp.Portfolio_ID = a.Portfolio_ID
    JOIN Coins c ON a.Coin_ID = c.Coin_ID
WHERE 
    u.User_ID = ?
ORDER BY 
    LossAmount ASC
LIMIT 1;`;   // ? in the query prevents sql injection attacks. The ? will be replaced by the value in the values array
    const values = [userId];
    const [data] = await db.execute(query, values);
    db.end();

    return NextResponse.json({ results: data });
  } catch (error:any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

