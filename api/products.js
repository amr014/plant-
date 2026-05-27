import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("plant-store");

  const products = await db.collection("products").find().toArray();

  res.json(products);
}