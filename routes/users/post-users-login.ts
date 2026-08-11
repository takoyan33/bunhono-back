import { Hono } from "hono";
import { compare } from "bcrypt";
import sql from "../../api/db";

export const app = new Hono();

app.post("/users/login", async (c) => {
  const body = await c.req.json();
  const email = body["email"];
  const password = body["password"];

  if (!password || !email) {
    return c.json({ message: "email と password は必須です" }, 400);
  }

  const users = await sql`SELECT * FROM users WHERE email = ${email}`;

  if (users.length === 0) {
    return c.json({ message: "ユーザーが見つかりません" }, 404);
  }

  const user = users[0];
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
