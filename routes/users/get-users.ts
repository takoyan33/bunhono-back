import { Hono } from "hono";

// 1. D1 バインディングの型定義
type Bindings = {
  DB: D1Database;
};

// 2. Bindings 型を指定して Hono インスタンスを作成
export const app = new Hono<{ Bindings: Bindings }>();

// ユーザー一覧を取得する共通処理
const getUsers = async (c: any) => {
  // 3. prepare() + all() で全件取得
  const { results } = await c.env.DB.prepare("SELECT * FROM users").all();

  return c.json(results);
};

// 末尾スラッシュ（/）の有無の両方に対応
app.get("/users", getUsers);
app.get("/users/", getUsers);

export default app;
