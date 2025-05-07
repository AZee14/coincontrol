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
    //find the best performing coin
    const query = `
    SELECT 
        c.Coin_Name AS Coin_Name,
        a.Profit_Loss AS profit_amount,
        ((a.Profit_Loss / SUM(th.Value)) * 100) AS profit_percentage
    FROM 
        Users u
    JOIN 
        Current_Portfolio cp ON u.User_ID = cp.User_ID
    JOIN 
        Assets a ON cp.Portfolio_ID = a.Portfolio_ID
    JOIN 
        Coins c ON a.Coin_ID = c.Coin_ID
    JOIN 
        Transaction_History th ON th.Portfolio_ID = cp.Portfolio_ID AND th.Coin_ID = a.Coin_ID
    WHERE 
        u.User_ID = ?
    GROUP BY 
        c.Coin_Name, a.Profit_Loss
    ORDER BY 
        profit_amount ASC
    LIMIT 1;
`;

    const values = [userId];
    const [data] = await db.execute(query, values);
    db.end();

    return NextResponse.json({ results: data });
} catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
}
}

