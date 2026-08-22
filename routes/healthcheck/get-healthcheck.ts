import { Hono } from "hono";

// 1. D1 バインディングの型定義
type Bindings = {
  DB: D1Database;
};

// 2. 型をインジェクションして Hono インスタンスを作成
export const app = new Hono<{ Bindings: Bindings }>();

/**
 * API-000
 * GET /healthcheck
 */
app.get("/healthcheck", async (c) => {
  return c.json(
    {
      status: "OK",
      message: "API is running.",
      timestamp: new Date().toISOString(),
    },
    200,
  );
});

// 3. 他のファイルから呼び出しやすいように default export も追加
export default app;
