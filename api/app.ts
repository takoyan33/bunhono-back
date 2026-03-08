import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";

export const app = new Hono();

const sql = neon(process.env.DATABASE_URL!);

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

app.get("/users", async (c) => {
  const users = await sql`SELECT * FROM users`;
  return c.json(users);
});
