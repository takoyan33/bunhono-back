import { Hono } from "hono";
import sql from "../../api/db";

export const app = new Hono();

app.get("/users/:id", async (c) => {
  const id = c.req.param("id");
  const users = await sql`SELECT * FROM users WHERE id = ${id}`;
  return c.json(users);
});

app.get("/users/:id/", async (c) => {
  const id = c.req.param("id");
  const users = await sql`SELECT * FROM users WHERE id = ${id}`;
  return c.json(users);
});
