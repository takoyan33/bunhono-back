import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

export const app = new Hono<{ Bindings: Bindings }>();

// API-009: カート商品の数量更新
app.patch("/cart-items/:id", async (c) => {
  const id = c.req.param("id");

  // Path Parameter の存在チェック
  if (!id) {
    return c.json({ message: "id は必須です。" }, 400);
  }

  // Body の取得とバリデーション
  let body: { quantity?: number };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ message: "リクエストボディが無効です。" }, 400);
  }

  const { quantity } = body;

  // バリデーション: quantity は必須かつ 1 以上
  if (
    quantity === undefined ||
    quantity === null ||
    typeof quantity !== "number" ||
    quantity < 1
  ) {
    return c.json({ message: "quantity は 1 以上で指定してください。" }, 400);
  }

  // カート商品の存在確認
  const existingItem = await c.env.DB.prepare(
    "SELECT id, cart_id, product_id, quantity, created_at FROM cart_items WHERE id = ?",
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

  // 数量の更新実行 (SQLite/D1 の RETURNING 句を使用)
  const updatedItem = await c.env.DB.prepare(
    "UPDATE cart_items SET quantity = ? WHERE id = ? RETURNING id, cart_id, product_id AS product_variant_id, quantity, created_at",
  )
    .bind(quantity, id)
    .first<{
      id: string;
      cart_id: string;
      product_variant_id: string;
      quantity: number;
      created_at: string;
    }>();

  if (!updatedItem) {
    return c.json({ message: "更新処理に失敗しました。" }, 500);
  }

  // レスポンス整形 (ISO形式のupdated_atを追加)
  const responseData = {
    ...updatedItem,
    updated_at: new Date().toISOString(),
  };

  return c.json(responseData, 200);
});

export default app;
