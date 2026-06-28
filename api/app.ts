import { Hono, type Context } from "hono";
import { neon } from "@neondatabase/serverless";
import * as bcrypt from "bcrypt";

export const app = new Hono();

const sql = neon(process.env.DATABASE_URL!);

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

// API-000 /healthcheck ヘルスチェック
app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

// 01_user一覧を取得
// const listUsers = async (c: Context) => {
//   const users = await sql`SELECT * FROM users`;
//   return c.json(users);
// };

// app.get("/users", listUsers);

// // 02_user詳細を取得
// const getUserById = async (c: Context) => {
//   const id = c.req.param("id");
//   const users = await sql`SELECT * FROM users WHERE id = ${id}`;
//   return c.json(users);
// };

// app.get("/users/:id", getUserById);

// API-001 /users/add ユーザー新規登録
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

//API-002 POST /users/login ログイン
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

  return c.json(
    {
      message: "ログイン成功",
      user: { id: user.id, name: user.name, email: user.email },
    },
    200
  );
});

//API-003 GET /addresses 住所一覧取得

const listAddresses = async (c: Context) => {
  const addresses = await sql`SELECT * FROM addresses`;
  return c.json(addresses);
};

app.get("/addresses", listAddresses);

//API-004 POST /addresses 住所登録

//API-005 GET /products 商品一覧取得

const listProducts = async (c: Context) => {
  const products = await sql`SELECT * FROM products`;
  return c.json(products);
};

app.get("/products", listProducts);

//API-006 GET /products/:id 商品詳細取得

const getProductsById = async (c: Context) => {
  const id = c.req.param("id");
  const products = await sql`SELECT * FROM products WHERE id = ${id}`;
  return c.json(products);
};

app.get("/users/:id", getProductsById);

//API-007 GET /carts/me カート取得

const listCartsMe = async (c: Context) => {
  const cartsMe = await sql`SELECT * FROM cartsMe`;
  return c.json(cartsMe);
};

app.get("/carts/me", listCartsMe);

// 開発STOP
//API-008 POST /carts/items カートへ商品追加
//API-009 PATCH /cart-items/:id カート商品の数量更新
//API-010 DELETE /cart-items/:id カート商品削除
//API-011 POST /orders 注文作成
//API-012 GET /orders 注文一覧取得
//API-013 GET /orders/:id 注文詳細取得
//API-014 POST /payments 決済情報作成
