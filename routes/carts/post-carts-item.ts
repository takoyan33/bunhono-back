import { Hono } from "hono";

// 1. D1 バインディングの型を設定
type Bindings = {
  DB: D1Database;
};

// 型を渡して Hono をインスタンス化
export const app = new Hono<{ Bindings: Bindings }>();

app.post("/carts/items", async (c) => {
  const body = await c.req.json();
  // ※本来は認証トークンからuser_idを取得しますが、テスト用にbodyから取得しています
  const user_id: string = body["user_id"];
  const product_id: string = body["product_id"];
  const quantity: number = body["quantity"] || 1;

  if (!user_id || !product_id) {
    return c.json({ message: "user_id と product_id は必須です" }, 400);
  }

  // 1. ユーザーのカートが存在するか確認
  let cart = await c.env.DB.prepare("SELECT id FROM carts WHERE user_id = ?")
    .bind(user_id)
    .first<{ id: string }>();

  // 2. カートが無ければ新規作成
  if (!cart) {
    const newCartId = crypto.randomUUID();
    cart = await c.env.DB.prepare(
      "INSERT INTO carts (id, user_id) VALUES (?, ?) RETURNING id"
    )
      .bind(newCartId, user_id)
      .first<{ id: string }>();
      
    if (!cart) {
      return c.json({ message: "カートの作成に失敗しました" }, 500);
    }
  }

  const cartId = cart.id;

  // 3. 既にカート内に同じ商品があるか確認
  const existingItem = await c.env.DB.prepare(
    "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?"
  )
    .bind(cartId, product_id)
    .first<{ id: string; quantity: number }>();

  let cartItem;

  if (existingItem) {
    // 4a. 既に存在する場合は数量を加算 (UPDATE)
    cartItem = await c.env.DB.prepare(
      "UPDATE cart_items SET quantity = quantity + ? WHERE id = ? RETURNING *"
    )
      .bind(quantity, existingItem.id)
      .first();
  } else {
    // 4b. 存在しない場合は新規追加 (INSERT)
    const itemId = crypto.randomUUID();
    cartItem = await c.env.DB.prepare(
      "INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES (?, ?, ?, ?) RETURNING *"
    )
      .bind(itemId, cartId, product_id, quantity)
      .first();
  }

  return c.json(cartItem, 201);
});

export default app;
