import { Hono } from "hono";
import { hash } from "bcryptjs"; // Workers 互換の bcryptjs に変更

// 1. D1 バインディングの型定義
type Bindings = {
  DB: D1Database;
};

// 2. Bindings 型を指定して Hono インスタンスを作成
export const app = new Hono<{ Bindings: Bindings }>();

app.post("/addresses", async (c) => {
  const body = await c.req.json();
  // TODO: 本来は認証ミドルウェアから user_id を取得すべきですが、テスト用に body から受け取ります
  const user_id: string = body["user_id"]; 
  const postal_code: string = body["postal_code"];
  const prefecture: string = body["prefecture"];
  const city: string = body["city"];
  const address_line1: string = body["address_line1"];
  const address_line2: string = body["address_line2"];
  const phone_number: string = body["phone_number"];
  const id = crypto.randomUUID();

  // 3. D1 では RETURNING を使って追加したレコードを直接取得（SQLite 3.35+ 互換）
  // SQL インジェクション攻撃を防ぐため、バインドを使用して値をエスケープしている
  const newAddress = await c.env.DB.prepare(
    "INSERT INTO addresses (id, user_id, postal_code, prefecture, city, address_line1, address_line2, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *"
  )
    .bind(
      id,
      user_id,
      postal_code,
      prefecture,
      city,
      address_line1,
      address_line2,
      phone_number
    )
    .first();

  return c.json(newAddress, 201);
});

export default app;
