import { Hono } from "hono";
import { compare } from "bcryptjs"; // Workers 互換の bcryptjs に変更

// 1. D1 バインディングの型定義
type Bindings = {
  DB: D1Database;
};

// 2. Bindings 型を指定して Hono インスタンスを作成
export const app = new Hono<{ Bindings: Bindings }>();

app.post("/users/login", async (c) => {
  const body = await c.req.json();
  const email = body["email"];
  const password = body["password"];

  if (!password || !email) {
    return c.json({ message: "email と password は必須です" }, 400);
  }

  // 3. D1 で prepare() + bind() + first() を使って email からユーザーを 1 件取得
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first<{
      id: string | number;
      name: string;
      email: string;
      password: string;
    }>();

  // 該当するユーザーが存在しない場合
  if (!user) {
    return c.json({ message: "ユーザーが見つかりません" }, 404);
  }

  // Workers 互換の compare (bcryptjs) でパスワード照合
  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    return c.json({ message: "パスワードが間違っています" }, 401);
  }

  return c.json(
    {
      message: "ログイン成功",
      user: { id: user.id, name: user.name, email: user.email },
    },
    200,
  );
});

export default app;
