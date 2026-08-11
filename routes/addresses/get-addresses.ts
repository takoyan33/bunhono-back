import { Hono } from "hono";
import sql from "../../api/db";

export const app = new Hono();

app.get("/addresses", async (c) => {
  const addresses = await sql`SELECT * FROM addresses`;
  return c.json(addresses);
});
