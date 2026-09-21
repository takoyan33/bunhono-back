import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

export const app = new Hono<{ Bindings: Bindings }>();

app.get("/carts/me", async (c) => {
  // 仮のログインユーザーID（認証ミドルウェア等から取得）
  const userId = "17ef47fc-6434-4661-aaed-ce41a5276ca6";

  // carts テーブルと cart_items, products を結合して取得するクエリ例
  const { results } = await c.env.DB.prepare(
    `SELECT 
       ci.id AS cart_item_id,
       ci.quantity,
       p.id AS product_id,
       p.name AS product_name,
       p.price,
       p.image_url
     FROM carts c
     JOIN cart_items ci ON c.id = ci.cart_id
     JOIN products p ON ci.product_id = p.id
     WHERE c.user_id = ?`,
  )
    .bind(userId)
    .all();

  return c.json(results);
});
