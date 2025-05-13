// src/utils/mongodb.ts
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

// Extend NodeJS global object to include mongo
declare global {
  // eslint-disable-next-line no-var
  var mongo: {
    conn: { client: MongoClient; db: Db } | null;
    promise: Promise<{ client: MongoClient; db: Db }> | null;
  };
}

// Initialize the global.mongo if it doesn't exist
global.mongo ||= { conn: null, promise: null };

// At this point, TypeScript knows global.mongo is defined
const cached = global.mongo;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI as string).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
