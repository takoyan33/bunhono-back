# API 仕様書

小規模 EC サイト向けの API 仕様です。
既存の Hono 実装に合わせて、シンプルで拡張しやすい構成にしています。

## 共通ルール

- レスポンスは JSON を基本とする
- 成功時は適切な HTTP ステータスコードを返す
- エラー時は日本語メッセージを返す
- 入力値の検証は API 層で行う
- DB エラーはそのまま返さず、API 側で整形する

## 認証

現段階ではセッションまたはトークンの方式を固定せず、`users` を起点にした会員機能を前提とします。
実装時に必要に応じて JWT または Cookie 認証を追加します。

## エンドポイント一覧

API番号 メソッド エンドポイント 機能
API-000 /healthcheck ヘルスチェック
API-001 POST /users/add ユーザー新規登録
API-002 POST /users/login ログイン
API-003 GET /addresses 住所一覧取得
API-004 POST /addresses 住所登録
API-005 GET /products 商品一覧取得
API-006 GET /products/:id 商品詳細取得
API-007 GET /carts/me カート取得
API-008 POST /carts/items カートへ商品追加
API-009 PATCH /cart-items/:id カート商品の数量更新
API-010 DELETE /cart-items/:id カート商品削除
API-011 POST /orders 注文作成
API-012 GET /orders 注文一覧取得
API-013 GET /orders/:id 注文詳細取得
API-014 POST /payments 決済情報作成

### ユーザー

#### `POST /users/add`

ユーザーを新規作成する。

**Request**

```json
{
  "name": "Taro",
  "email": "taro@example.com",
  "password": "password123"
}
```

**Response 201**

```json
{
  "id": "uuid",
  "name": "Taro",
  "email": "taro@example.com",
  "created_at": "2026-06-26T00:00:00.000Z"
}
```

**Validation**

- `name` は必須
- `email` は必須
- `password` は必須
- `email` は重複不可

**Error**

- `400` name, email, password の不足
- `409` email 重複

#### `POST /users/login`

ログインを行う。

**Request**

```json
{
  "email": "taro@example.com",
  "password": "password123"
}
```

**Response 200**

```json
{
  "message": "ログイン成功",
  "user": {
    "id": "uuid",
    "name": "Taro",
    "email": "taro@example.com"
  }
}
```

**Validation**

- `email` は必須
- `password` は必須

**Error**

- `400` 必須項目不足
- `404` ユーザーが存在しない
- `401` パスワード不一致

### 住所

#### `GET /addresses`

ログインユーザーの住所一覧を取得する。

**Response 200**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Taro",
    "postal_code": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "street": "1-1-1",
    "building": "ABCビル",
    "phone": "090-0000-0000",
    "is_default": true
  }
]
```

#### `POST /addresses`

住所を追加する。

**Request**

```json
{
  "name": "Taro",
  "postal_code": "100-0001",
  "prefecture": "東京都",
  "city": "千代田区",
  "street": "1-1-1",
  "building": "ABCビル",
  "phone": "090-0000-0000",
  "is_default": true
}
```

**Validation**

- `name`, `postal_code`, `prefecture`, `city`, `street` は必須

### 商品

#### `GET /products`

公開中の商品一覧を取得する。

**Response 200**

```json
[
  {
    "id": "uuid",
    "name": "T-shirt",
    "slug": "t-shirt",
    "price": 3000,
    "status": "active"
  }
]
```

- status:  'draft', 'active', 'archived' 

#### `GET /products/:id`

商品詳細を取得する。

**Response 200**

```json
{
  "id": "uuid",
  "name": "T-shirt",
  "description": "sample",
  "price": 3000,
  "status": "active",
  "images": [],
  "variants": []
}
```

**Error**

- `404` 商品が存在しない

### カート

#### `GET /carts/me`

ログインユーザーのカートを取得する。

#### `POST /carts/items`

カートに商品を追加する。

**Request**

```json
{
  "product_variant_id": "uuid",
  "quantity": 1
}
```

**Validation**

- `product_variant_id` は必須
- `quantity` は 1 以上

#### `PATCH /cart-items/:id`

カート明細の数量を更新する。

#### `DELETE /cart-items/:id`

カート明細を削除する。

### 注文

#### `POST /orders`

カート内容から注文を作成する。

**Request**

```json
{
  "address_id": "uuid"
}
```

**Response 201**

```json
{
  "id": "uuid",
  "order_number": "ORD-20260626-0001",
  "status": "pending",
  "total_amount": 4500
}
```

**Validation**

- `address_id` は必須
- カートが空の場合は作成不可

#### `GET /orders`

ログインユーザーの注文一覧を取得する。

#### `GET /orders/:id`

注文詳細を取得する。

**Error**

- `404` 注文が存在しない

### 決済

#### `POST /payments`

注文に対して決済情報を作成する。

**Request**

```json
{
  "order_id": "uuid",
  "provider": "stripe",
  "payment_intent_id": "pi_xxx"
}
```

**Validation**

- `order_id` は必須
- `provider` は必須

## エラー仕様

| ステータス | 意味           |
| ---------- | -------------- |
| `400`      | 入力不備       |
| `401`      | 認証失敗       |
| `403`      | 権限不足       |
| `404`      | データなし     |
| `409`      | 重複・競合     |
| `500`      | サーバーエラー |

## 実装メモ

- `users` のような公開 API は末尾スラッシュ両対応にしてもよい
- 商品一覧は公開、カート・注文・住所は認証前提にする
- 注文時は `orders` と `order_items` を同一トランザクションで作成する
- 注文確定時に `product_variants.stock_quantity` を更新する
