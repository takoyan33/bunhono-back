import { Hono } from "hono";
import sql from "../../api/db";

export const app = new Hono();

app.get("/carts/me", async (c) => {
  const cartsMe = await sql`SELECT * FROM cartsMe`;
  return c.json(cartsMe);
});
