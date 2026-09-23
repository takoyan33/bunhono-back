import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

export const app = new Hono<{ Bindings: Bindings }>();

// API-010: カート商品の削除
app.delete("/carts/item/:id", async (c) => {
  const id = c.req.param("id");

  // Path Parameter の存在チェック
  if (!id) {
    return c.json({ message: "id は必須です。" }, 400);
  }

  // カート商品の存在確認
  const existingItem = await c.env.DB.prepare(
    "SELECT id, cart_id, product_id, quantity, created_at FROM cart_items WHERE id = ?"
  )
    .bind(id)
    .first<{
      id: string;
      cart_id: string;
      product_id: string;
      quantity: number;
      created_at: string;
    }>();

  if (!existingItem) {
    return c.json({ message: "カート商品が見つかりません。" }, 404);
  }

  // 削除実行 (SQLite/D1 の RETURNING 句を使用)
  const deletedItem = await c.env.DB.prepare(
    "DELETE FROM cart_items WHERE id = ? RETURNING id, cart_id, product_id AS product_variant_id, quantity, created_at"
  )
    .bind(id)
    .first<{
      id: string;
      cart_id: string;
      product_variant_id: string;
      quantity: number;
      created_at: string;
    }>();

  if (!deletedItem) {
    return c.json({ message: "削除処理に失敗しました。" }, 500);
  }

  // レスポンス整形 (ISO形式のupdated_atを追加)
  const responseData = {
    ...deletedItem,
    updated_at: new Date().toISOString(),
  };

  return c.json(responseData, 200);
});

export default app;
