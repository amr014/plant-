import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("plant-store");

  const order = req.body;

  const result = await db.collection("orders").insertOne(order);

  res.json(result);
}