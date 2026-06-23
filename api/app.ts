import { Hono, type Context } from "hono";
import { neon } from "@neondatabase/serverless";
import * as bcrypt from "bcrypt";

export const app = new Hono();

const sql = neon(process.env.DATABASE_URL!);

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

// 0_healthcheck
app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

// 01_user一覧を取得
const listUsers = async (c: Context) => {
  const users = await sql`SELECT * FROM users`;
  return c.json(users);
};

app.get("/users", listUsers);
app.get("/users/", listUsers);

// 02_user詳細を取得
const getUserById = async (c: Context) => {
  const id = c.req.param("id");
  const users = await sql`SELECT * FROM users WHERE id = ${id}`;
  return c.json(users);
};

app.get("/users/:id", getUserById);
app.get("/users/:id/", getUserById);

// 03_userを追加
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

  // パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  const users =
    await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword}) RETURNING *`;

  return c.json(users[0], 201);
});

// 認証
// 04_userを認証
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
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return c.json({ message: "パスワードが間違っています" }, 401);
  }

  return c.json({ message: "ログイン成功", user: { id: user.id, name: user.name, email: user.email } }, 200);
});
