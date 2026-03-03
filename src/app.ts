import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";

export const app = new Hono();

const sql = neon(process.env.DATABASE_URL!);

app.get("/", (c) => {
  return c.json({ message: "Hello Hono 🚀" });
});

app.get("/users", async (c) => {
  const users = await sql`SELECT * FROM users`;
  return c.json(users);
});
