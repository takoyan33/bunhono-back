import { Hono } from "hono";
import sql from "../../api/db";

export const app = new Hono();

app.get("/products", async (c) => {
  const products = await sql`SELECT * FROM products`;
  return c.json(products);
});
