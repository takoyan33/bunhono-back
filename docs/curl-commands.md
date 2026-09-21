# API テスト用 curl コマンド集

ローカルサーバー (`http://localhost:8787`) をテストするための `curl` コマンド一覧です。

---

## 1. ヘルスチェック (`GET /healthcheck` または `GET /`)
```bash
curl -X GET http://localhost:8787/
```

## 2. ユーザー関連

### ユーザー新規登録 (`POST /users/add`)
```bash
curl -X POST http://localhost:8787/users/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "テストユーザー",
    "email": "test-user1@example.com",
    "password": "password123"
  }'
```

### ユーザーログイン (`POST /users/login`)
```bash
curl -X POST http://localhost:8787/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-user1@example.com",
    "password": "password123"
  }'
```

### ユーザー一覧取得 (`GET /users`)
```bash
curl -X GET http://localhost:8787/users
```

---

## 3. 住所関連

### 住所一覧取得 (`GET /addresses`)
```bash
curl -X GET http://localhost:8787/addresses
```

### 住所登録 (`POST /addresses`)
※ `YOUR_USER_ID` の部分は、ユーザー登録時に返ってきた `id` に置き換えてください。
```bash
curl -X POST http://localhost:8787/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "postal_code": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "address_line1": "千代田1-1-1",
    "address_line2": "テストビル 101",
    "phone_number": "090-1234-5678"
  }'
```

---

## 4. 商品関連

### 商品一覧取得 (`GET /products`)
```bash
curl -X GET http://localhost:8787/products
```

### 商品詳細取得 (`GET /products/:id`)
※ `PRODUCT_ID` を実際の商品IDに置き換えてください。
```bash
curl -X GET http://localhost:8787/products/PRODUCT_ID
```

---

## 5. カート関連

### カート取得 (`GET /carts/me`)
```bash
curl -X GET http://localhost:8787/carts/me
```

### カートへ商品追加 (`POST /carts/items`)
```bash
curl -X POST http://localhost:8787/carts/items \
  -H "Content-Type: application/json" \
  -d '{
    "cart_id": "YOUR_CART_ID",
    "product_id": "YOUR_PRODUCT_ID",
    "quantity": 1
  }'
```

### カート商品の数量更新 (`PATCH /cart-items/:id`)
```bash
curl -X PATCH http://localhost:8787/cart-items/ITEM_ID \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

### カート商品削除 (`DELETE /cart-items/:id`)
```bash
curl -X DELETE http://localhost:8787/cart-items/ITEM_ID
```

---

## 6. 注文関連

### 注文作成 (`POST /orders`)
```bash
curl -X POST http://localhost:8787/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "shipping_address_id": "YOUR_ADDRESS_ID"
  }'
```

### 注文一覧取得 (`GET /orders`)
```bash
curl -X GET http://localhost:8787/orders
```

### 注文詳細取得 (`GET /orders/:id`)
```bash
curl -X GET http://localhost:8787/orders/ORDER_ID
```

---

## 7. 決済関連

### 決済情報作成 (`POST /payments`)
```bash
curl -X POST http://localhost:8787/payments \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "YOUR_ORDER_ID",
    "amount": 5000,
    "provider": "stripe"
  }'
```
