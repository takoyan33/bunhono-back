import { Hono } from "hono";
import { config } from "dotenv";
import sql from "./db";

config();

const app = new Hono();

// ヘルスチェック
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Neonからデータ取得
app.get("/users", async (c) => {
  try {
    const users = await sql`SELECT * FROM users`;
    return c.json(users);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Database error" }, 500);
  }
});

export default app;
