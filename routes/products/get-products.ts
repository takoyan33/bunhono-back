import { Hono } from "hono";

// 1. D1 バインディングの型を設定
type Bindings = {
  DB: D1Database;
};

// 型を渡して Hono をインスタンス化
export const app = new Hono<{ Bindings: Bindings }>();

app.get("/products", async (c) => {
  // 2. c.env.DB からクエリを実行し、results を取得
  const { results } = await c.env.DB.prepare("SELECT * FROM products").all();

  return c.json(results);
});
