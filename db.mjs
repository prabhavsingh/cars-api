import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const client = new MongoClient(uri);
const dbName = "cars";
export let db = null;

export async function connectToMongoDB() {
  try {
    const con = await client.connect();
    db = con.db(dbName);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDb", error);
    throw error;
  }
}
