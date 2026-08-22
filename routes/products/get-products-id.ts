import { Hono } from "hono";

// 1. D1 バインディングの型を定義
type Bindings = {
  DB: D1Database;
};

// 2. Bindings 型を指定して Hono インスタンスを作成
export const app = new Hono<{ Bindings: Bindings }>();

app.get("/products/:id", async (c) => {
  const id = c.req.param("id");

  // 3. D1 でプレースホルダー（?）を使い、.bind() で ID を指定して .first() で1件取得
  const product = await c.env.DB.prepare("SELECT * FROM products WHERE id = ?")
    .bind(id)
    .first();

  // 4. 対象の商品が存在しない場合は 404 エラーを返す
  if (!product) {
    return c.json({ message: "Product not found" }, 404);
  }

  return c.json(product);
});

export default app;
