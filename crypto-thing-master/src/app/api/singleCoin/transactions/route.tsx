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

    // A query to get transaction details of the user as before but this time only for this coin instead of all coins wrt to that user
    // Loss should be denoted by minus sign in all attributes
    const query = `SELECT
    CONCAT(u.First_Name, ' ', u.Last_Name) AS User_Name,
    c.Symbol AS Coin_Symbol,
    CASE
        WHEN a.Profit_Loss >= 0 THEN a.Profit_Loss
        ELSE -a.Profit_Loss
    END AS Profit_Loss,
    CASE
        WHEN a.Profit_Loss >= 0 THEN CONCAT('+', (a.Profit_Loss / NULLIF(a.Value, 0) * 100), '%')
        ELSE CONCAT('-', (-a.Profit_Loss / NULLIF(a.Value, 0) * 100), '%')
    END AS Percentage_Profit_Loss
FROM
    Users u
JOIN
    Current_Portfolio cp ON u.User_ID = cp.User_ID
JOIN
    Assets a ON cp.Portfolio_ID = a.Portfolio_ID
JOIN
    Coins c ON a.Coin_ID = c.Coin_ID
WHERE
    u.User_ID = ? AND c.Coin_ID = ?;`; // ? in the query prevents sql injection attacks. The ? will be replaced by the value in the values array

    const values = [userId, coinId];
    const [data] = await db.execute(query, values);
    db.end();

    return NextResponse.json({ results: data });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
