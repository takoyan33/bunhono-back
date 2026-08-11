# データベース定義書

小規模 EC サイトを想定した、最小構成のデータベース定義です。
会員登録、商品閲覧、カート、注文、決済、配送先管理までをカバーします。

## 設計方針

- 1 つの商品に複数の画像を持てる
- 1 つの商品に複数のバリエーションを持てる
- 注文時の商品情報は `order_items` にスナップショット保存する
- 住所は `users` に直書きせず `addresses` に分離する
- 在庫はバリエーション単位で管理する

## テーブル一覧

- `users`
- `addresses`
- `categories`
- `products`
- `product_images`
- `product_variants`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `payments`

## テーブル定義

### `users`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | ユーザー ID |
| `name` | `text` | `NOT NULL` | ユーザー名 |
| `email` | `text` | `NOT NULL`, `UNIQUE` | ログイン用メールアドレス |
| `password` | `text` | `NOT NULL` | ハッシュ化済みパスワード |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

**インデックス**

- `UNIQUE INDEX` on `email`

### `addresses`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 住所 ID |
| `user_id` | `uuid` | `NOT NULL`, `FOREIGN KEY` | 所有ユーザー |
| `name` | `text` | `NOT NULL` | 宛名 |
| `postal_code` | `text` | `NOT NULL` | 郵便番号 |
| `prefecture` | `text` | `NOT NULL` | 都道府県 |
| `city` | `text` | `NOT NULL` | 市区町村 |
| `street` | `text` | `NOT NULL` | 番地 |
| `building` | `text` | `NULL` | 建物名 |
| `phone` | `text` | `NULL` | 電話番号 |
| `is_default` | `boolean` | `NOT NULL`, `DEFAULT false` | デフォルト住所かどうか |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

**インデックス**

- `INDEX` on `user_id`
- `INDEX` on `user_id, is_default`

### `categories`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | カテゴリ ID |
| `name` | `text` | `NOT NULL`, `UNIQUE` | カテゴリ名 |
| `slug` | `text` | `NOT NULL`, `UNIQUE` | URL 用識別子 |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

**インデックス**

- `UNIQUE INDEX` on `name`
- `UNIQUE INDEX` on `slug`

### `products`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 商品 ID |
| `name` | `text` | `NOT NULL` | 商品名 |
| `description` | `text` | `NULL` | 商品説明 |
| `slug` | `text` | `NOT NULL`, `UNIQUE` | URL 用識別子 |
| `price` | `integer` | `NOT NULL` | 基本価格 |
| `status` | `text` | `NOT NULL`, `DEFAULT 'draft'` | `draft` / `active` / `archived` |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

**インデックス**

- `UNIQUE INDEX` on `slug`
- `INDEX` on `status`

### `product_images`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 画像 ID |
| `product_id` | `uuid` | `NOT NULL`, `FOREIGN KEY` | 紐づく商品 |
| `image_url` | `text` | `NOT NULL` | 画像 URL |
| `sort_order` | `integer` | `NOT NULL`, `DEFAULT 0` | 表示順 |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |

**インデックス**

- `INDEX` on `product_id`
- `INDEX` on `product_id, sort_order`

### `product_variants`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | バリアント ID |
| `product_id` | `uuid` | `NOT NULL`, `FOREIGN KEY` | 紐づく商品 |
| `sku` | `text` | `NOT NULL`, `UNIQUE` | 在庫管理用 SKU |
| `variant_name` | `text` | `NOT NULL` | バリアント名 |
| `price` | `integer` | `NOT NULL` | 販売価格 |
| `stock_quantity` | `integer` | `NOT NULL`, `DEFAULT 0` | 在庫数 |
| `is_active` | `boolean` | `NOT NULL`, `DEFAULT true` | 販売中かどうか |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

**インデックス**

- `UNIQUE INDEX` on `sku`
- `INDEX` on `product_id`
- `INDEX` on `is_active`

### `carts`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | カート ID |
| `user_id` | `uuid` | `NOT NULL`, `FOREIGN KEY`, `UNIQUE` | 所有ユーザー |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

**インデックス**

- `UNIQUE INDEX` on `user_id`

### `cart_items`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | カート明細 ID |
| `cart_id` | `uuid` | `NOT NULL`, `FOREIGN KEY` | 紐づくカート |
| `product_variant_id` | `uuid` | `NOT NULL`, `FOREIGN KEY` | 紐づくバリアント |
| `quantity` | `integer` | `NOT NULL`, `CHECK (quantity > 0)` | 数量 |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

**インデックス**

- `INDEX` on `cart_id`
- `INDEX` on `product_variant_id`
- `UNIQUE INDEX` on `cart_id, product_variant_id`

### `orders`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 注文 ID |
| `user_id` | `uuid` | `NOT NULL`, `FOREIGN KEY` | 注文者 |
| `address_id` | `uuid` | `NOT NULL`, `FOREIGN KEY` | 配送先住所 |
| `order_number` | `text` | `NOT NULL`, `UNIQUE` | 注文番号 |
| `status` | `text` | `NOT NULL`, `DEFAULT 'pending'` | 注文状態 |
| `subtotal_amount` | `integer` | `NOT NULL` | 商品小計 |
| `shipping_amount` | `integer` | `NOT NULL`, `DEFAULT 0` | 配送料 |
| `discount_amount` | `integer` | `NOT NULL`, `DEFAULT 0` | 割引額 |
| `tax_amount` | `integer` | `NOT NULL`, `DEFAULT 0` | 消費税 |
| `total_amount` | `integer` | `NOT NULL` | 合計金額 |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

**インデックス**

- `UNIQUE INDEX` on `order_number`
- `INDEX` on `user_id`
- `INDEX` on `status`

### `order_items`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 注文明細 ID |
| `order_id` | `uuid` | `NOT NULL`, `FOREIGN KEY` | 紐づく注文 |
| `product_id` | `uuid` | `NOT NULL`, `FOREIGN KEY` | 商品 ID |
| `product_variant_id` | `uuid` | `NOT NULL`, `FOREIGN KEY` | バリアント ID |
| `product_name_snapshot` | `text` | `NOT NULL` | 注文時の商品名 |
| `variant_name_snapshot` | `text` | `NOT NULL` | 注文時のバリアント名 |
| `unit_price_snapshot` | `integer` | `NOT NULL` | 注文時単価 |
| `quantity` | `integer` | `NOT NULL`, `CHECK (quantity > 0)` | 数量 |
| `line_total` | `integer` | `NOT NULL` | 行合計 |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |

**インデックス**

- `INDEX` on `order_id`
- `INDEX` on `product_id`
- `INDEX` on `product_variant_id`

### `payments`

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 決済 ID |
| `order_id` | `uuid` | `NOT NULL`, `FOREIGN KEY`, `UNIQUE` | 紐づく注文 |
| `provider` | `text` | `NOT NULL` | 決済事業者 |
| `payment_intent_id` | `text` | `NULL`, `UNIQUE` | 外部決済 ID |
| `status` | `text` | `NOT NULL`, `DEFAULT 'pending'` | 決済状態 |
| `amount` | `integer` | `NOT NULL` | 決済金額 |
| `paid_at` | `timestamp` | `NULL` | 支払日時 |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamp` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

**インデックス**

- `UNIQUE INDEX` on `order_id`
- `UNIQUE INDEX` on `payment_intent_id`
- `INDEX` on `status`

## リレーション

- `users` 1 - N `addresses`
- `users` 1 - 1 `carts`
- `users` 1 - N `orders`
- `categories` 1 - N `products`
- `products` 1 - N `product_images`
- `products` 1 - N `product_variants`
- `carts` 1 - N `cart_items`
- `product_variants` 1 - N `cart_items`
- `orders` 1 - N `order_items`
- `orders` 1 - 1 `payments`
- `addresses` 1 - N `orders`

## 補足

- 商品カテゴリの多対多が必要になった場合は `product_categories` を追加する
- レビュー機能が必要になった場合は `reviews` を追加する
- クーポン機能が必要になった場合は `coupons` と `order_discounts` を追加する
- 在庫履歴を追跡したい場合は `inventory_movements` を追加する
