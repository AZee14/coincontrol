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

    // A query to get the portfolio condition in past 24h like profit/loss amount and percentage
    // Loss should be denoted by minus sign in both attributes 
    const query = `SELECT
    cp.Portfolio_ID,
    cp.User_ID,
    cp.Total_Investment,
    cp.Total_Value_Now,
    COALESCE(SUM(CASE
        WHEN th.Transaction_Type = 'Buy' THEN th.Value
        WHEN th.Transaction_Type = 'Sell' THEN -th.Value
        ELSE 0
    END), 0) AS Net_Transaction_Value_24H,
    ((cp.Total_Value_Now - cp.Total_Investment) / cp.Total_Investment) * 100 AS Profit_Loss_Percentage
FROM
    Current_Portfolio cp
    LEFT JOIN Transaction_History th ON cp.Portfolio_ID = th.Portfolio_ID
    LEFT JOIN Coins c ON th.Coin_ID = c.Coin_ID
WHERE
    cp.User_ID = ?
    AND th.Date >= NOW() - INTERVAL 1 DAY
GROUP BY
    cp.Portfolio_ID,
    cp.User_ID,
    cp.Total_Investment,
    cp.Total_Value_Now;`;   // ? in the query prevents sql injection attacks. The ? will be replaced by the value in the values array
    const values = [userId];
    const [data] = await db.execute(query, values);
    db.end();

    return NextResponse.json({ results: data });
  } catch (error:any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

