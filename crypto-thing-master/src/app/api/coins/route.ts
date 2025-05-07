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

  try {
    // A query to get the details of all the coins i.e. their name, shorthand notation and their current market price
    const query = "SELECT coin_id,coin_name,symbol,marketPrice FROM Coins;";
    const [data] = await db.execute(query);
    db.end();

    return NextResponse.json({ results: data });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, res: Response) {
  const requestData = await req.json();

  try {
    const db = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_MYSQL_HOST,
      port: parseInt(process.env.NEXT_PUBLIC_MYSQL_PORT as string),
      database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
      user: process.env.NEXT_PUBLIC_MYSQL_USER,
      password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
    });

    // Loop through the array of objects and insert data into the database
    requestData.data.forEach(async (item: any) => {
      // Extracting necessary information from each object, if you want more information to fill data according to our database then just add it in similarly
      const { name, symbol, last_updated, circulating_supply, id } = item;
      const {
        price,
        market_cap,
        percent_change_1h,
        percent_change_24h,
        percent_change_7d,
      } = item.quote.USD;

      // Construct the SQL INSERT query
      const query = `UPDATE Coins 
      SET Coin_Name = ?, 
          Symbol = ?, 
          MarketPrice = ?, 
          MarketCap = ?, 
          Last_Updated = ?, 
          Volume24H = ?, 
          Volume1H = ?, 
          Volume7D = ?, 
          CirculatingSupply = ?
      WHERE Coin_ID = ?`;

      const values = [
        name,
        symbol,
        price,
        market_cap,
        last_updated,
        percent_change_24h,
        percent_change_1h,
        percent_change_7d,
        circulating_supply,
        id, // `id` is now the last element in the array to match the `Coin_ID`
      ];
      const [result] = await db.execute(query, values);
    });
    db.end();

    return NextResponse.json(
      { message: "Coins added successfully" },
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

// The data i am sending into this request will be an array of objects where each object is like this so just take anything else from it if needed:
// {
//   "circulating_supply": 19699081,
//   "cmc_rank": 1,
//   "date_added": "2010-07-13T00:00:00.000Z",
//   "id": 1,
//   "infinite_supply": false,
//   "last_updated": "2024-05-16T14:46:00.000Z",
//   "max_supply": 21000000,
//   "name": "Bitcoin",
//   "num_market_pairs": 11046,
//   "platform": null,
//   "quote": {
//      "USD": {
//         "fully_diluted_market_cap": 1387912089578.73,
//         "last_updated": "2024-05-16T14:46:00.000Z",
//         "market_cap": 1301932984451.9407,
//         "market_cap_dominance": 54.8309,
//         "percent_change_1h": -0.13657486,
//         "percent_change_7d": 7.72463412,
//         "percent_change_24h": 2.74506355,
//         "percent_change_30d": 5.63596687,
//         "percent_change_60d": -1.79623427,
//         "percent_change_90d": 26.92190712,
//         "price": 66091.05188470166,
//         "tvl": null,
//         "volume_24h": 36648199318.96642,
//         "volume_change_24h": 18.1554
//      }
//   },
//   "self_reported_circulating_supply": null,
//   "self_reported_market_cap": null,
//   "slug": "bitcoin",
//   "symbol": "BTC",
//   "tags": [
//      "mineable",
//      "pow",
//      "sha-256",
//      "store-of-value",
//      "state-channel",
//      "coinbase-ventures-portfolio",
//      "three-arrows-capital-portfolio",
//      "polychain-capital-portfolio",
//      "binance-labs-portfolio",
//      "blockchain-capital-portfolio",
//      "boostvc-portfolio",
//      "cms-holdings-portfolio",
//      "dcg-portfolio",
//      "dragonfly-capital-portfolio",
//      "electric-capital-portfolio",
//      "fabric-ventures-portfolio",
//      "framework-ventures-portfolio",
//      "galaxy-digital-portfolio",
//      "huobi-capital-portfolio",
//      "alameda-research-portfolio",
//      "a16z-portfolio",
//      "1confirmation-portfolio",
//      "winklevoss-capital-portfolio",
//      "usv-portfolio",
//      "placeholder-ventures-portfolio",
//      "pantera-capital-portfolio",
//      "multicoin-capital-portfolio",
//      "paradigm-portfolio",
//      "bitcoin-ecosystem",
//      "ftx-bankruptcy-estate"
//   ],
//   "total_supply": 19699081,
//   "tvl_ratio": null
// }
