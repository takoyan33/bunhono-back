import { Hono } from "hono";

// 1. D1 バインディングの型定義
type Bindings = {
  DB: D1Database;
};

// 2. Bindings 型を指定して Hono インスタンスを作成
export const app = new Hono<{ Bindings: Bindings }>();

// ユーザー情報を取得する共通処理
const getUserById = async (c: any) => {
  const id = c.req.param("id");

  // 3. prepare() + bind() + first() で 1 件取得
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?")
    .bind(id)
    .first();

  // 該当するユーザーが存在しない場合は 404 を返す
  if (!user) {
    return c.json({ message: "User not found" }, 404);
  }

  return c.json(user);
};

// パス末尾のスラッシュ（/）有無の両方に対応
app.get("/users/:id", getUserById);
app.get("/users/:id/", getUserById);

export default app;
