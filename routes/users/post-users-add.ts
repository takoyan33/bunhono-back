import { Hono } from "hono";
import { hash } from "bcryptjs"; // Workers 互換の bcryptjs に変更

// 1. D1 バインディングの型定義
type Bindings = {
  DB: D1Database;
};

// 2. Bindings 型を指定して Hono インスタンスを作成
export const app = new Hono<{ Bindings: Bindings }>();

app.post("/users/add", async (c) => {
  const body = await c.req.json();
  const name: string = body["name"];
  const email: string = body["email"];
  const password: string = body["password"];

  if (!name) {
    return c.json({ message: "name は必須です" }, 400);
  }
  if (!email) {
    return c.json({ message: "email は必須です" }, 400);
  }
  if (!password) {
    return c.json({ message: "password は必須です" }, 400);
  }

  // Workers 互換のハッシュ化（bcryptjs）
  const hashedPassword = await hash(password, 10);

  // 3. D1 では RETURNING を使って追加したレコードを直接取得（SQLite 3.35+ 互換）
  const newUser = await c.env.DB.prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING *",
  )
    .bind(name, email, hashedPassword)
    .first();

  return c.json(newUser, 201);
});

export default app;
