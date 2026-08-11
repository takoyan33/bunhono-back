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

## API一覧（概要）

### API-000 `GET /healthcheck`

**概要**

APIサーバーが正常に起動しているかを確認するためのヘルスチェックAPIです。

---

### API-001 `POST /users/add`

**概要**

ユーザーを新規登録します。
登録時にパスワードはハッシュ化して保存します。

---

### API-002 `POST /users/login`

**概要**

メールアドレスとパスワードでログイン認証を行います。
認証成功時はユーザー情報を返却します。

---

### API-003 `GET /addresses`

**概要**

ログイン中のユーザーに登録されている住所一覧を取得します。

---

### API-004 `POST /addresses`

**概要**

ログイン中のユーザーの配送先住所を新規登録します。

---

### API-005 `GET /products`

**概要**

公開中（active）の商品一覧を取得します。

---

### API-006 `GET /products/:id`

**概要**

指定された商品の詳細情報を取得します。

---

### API-007 `GET /carts/me`

**概要**

ログイン中のユーザーのショッピングカート情報を取得します。

---

### API-008 `POST /carts/items`

**概要**

商品をショッピングカートへ追加します。

---

### API-009 `PATCH /cart-items/:id`

**概要**

ショッピングカート内の商品の数量を変更します。

---

### API-010 `DELETE /cart-items/:id`

**概要**

ショッピングカートから指定した商品を削除します。

---

### API-011 `POST /orders`

**概要**

カート内の商品をもとに注文を作成します。
注文と注文明細を同一トランザクションで登録します。

---

### API-012 `GET /orders`

**概要**

ログイン中のユーザーの注文履歴一覧を取得します。

---

### API-013 `GET /orders/:id`

**概要**

指定した注文の詳細情報を取得します。

---

### API-014 `POST /payments`

**概要**

注文に対する決済情報を登録します。
決済サービス（Stripeなど）の決済情報を保存します。