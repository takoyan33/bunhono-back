import { Hono } from "hono";
import sql from "../../api/db";

export const app = new Hono();

app.get("/products/:id", async (c) => {
  const id = c.req.param("id");
  const products = await sql`SELECT * FROM products WHERE id = ${id}`;
  return c.json(products);
});
