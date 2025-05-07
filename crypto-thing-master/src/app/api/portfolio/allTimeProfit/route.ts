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

    //query to calculate the coin that had made the user the most profit for all his transactions
    const query = `
    Select concat(users.First_Name, users.Last_Name) AS Name, coins.Coin_Name, (Total_Value_Now - Total_Investment) AS Total_Profit
            ((Total_Value_Now - Total_Investment)/Total_Investment * 100) AS Percentage_Profit
    From current_portfolio,coins, assets, users
    Where current_portfolio.User_ID = 'user-test-bf51e992-be5a-464f-ac7c-c89069f1463f' AND  
                current_portfolio.Portfolio_ID = assets.Portfolio_ID AND
                assets.Coin_ID = coins.Coin_ID; `;
    const values = [userId];
    const [data] = await db.execute(query, values);
    db.end();

    return NextResponse.json({ results: data });
} catch (error:any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
}
}