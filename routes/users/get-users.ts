import { Hono } from "hono";
import sql from "../../api/db";

export const app = new Hono();

app.get("/users", async (c) => {
  const users = await sql`SELECT * FROM users`;
  return c.json(users);
});

app.get("/users/", async (c) => {
  const users = await sql`SELECT * FROM users`;
  return c.json(users);
});
