# 実装計画書

小規模 EC サイトを段階的に実装するための計画です。
既存の Hono 実装を崩さず、DB 設計・API 設計・テストを順番に固めます。

## 目的

- 小規模 EC サイトの基盤を作る
- 商品閲覧、カート、注文、決済までの流れを実装する
- 拡張しやすい DB 構造と API 構造を保つ

## 実装順序

### 1. DB 基盤の整備

- PostgreSQL / Neon 前提の接続設定を確認する
- `users`, `addresses`, `categories`, `products`, `product_images`, `product_variants`, `carts`, `cart_items`, `orders`, `order_items`, `payments` を作成する
- 外部キーとインデックスを設定する
- `users.email`, `products.slug`, `product_variants.sku`, `orders.order_number` などの一意制約を設定する
- 必要なら初期データを投入する

### 2. Repository 層の実装

- テーブル単位の DB 操作を切り出す
- `SELECT`, `INSERT`, `UPDATE`, `DELETE` を責務ごとに分離する
- 注文作成のような複数テーブル更新は Repository 単位で扱う

### 3. Service 層の実装

- ユーザー登録やログインのような業務ロジックをまとめる
- 注文作成時の金額計算、在庫更新、スナップショット生成をまとめる
- バリデーションとドメインルールを Service 層で整理する

### 4. API Route の実装

- `users`
- `addresses`
- `products`
- `carts`
- `orders`
- `payments`

の順に実装する

### 5. テストの実装

- ユーザー系の API テストを追加する
- 商品一覧と詳細の取得テストを追加する
- カート追加と注文作成のテストを追加する
- 主要なバリデーションエラーを確認する

### 6. 仕上げ

- エラーハンドリングを統一する
- 型エラーを解消する
- 不要な重複処理を整理する
- ドキュメントを更新する

## ディレクトリ構成

```text
.
├── api
│   ├── app.ts
│   ├── app.test.ts
│   ├── db.ts
│   └── (repository / service を追加する場合の配置先)
├── docs
│   ├── database-definition.md
│   ├── api-specification.md
│   ├── er-diagram.mmd
│   └── implementation-plan.md
├── index.ts
├── lib
│   └── server.ts
└── README.md
```

## DB 実装方針

- 接続情報は `DATABASE_URL` に集約する
- 接続エラーは起動時に検知する
- SQL はテンプレートリテラルで安全に渡す
- 注文のような整合性が必要な処理はトランザクション前提で実装する
- 平文パスワードは保存しない
- 注文時の商品情報はスナップショットとして保存する

## API 実装方針

- ルートは REST 風に整理する
- 成功時のレスポンス形式を統一する
- エラー時は日本語メッセージを返す
- 入力検証を先に行う
- 認証が必要な API と公開 API を分ける
- `GET /products` のような公開 API は取得しやすさを優先する
- カートや注文はログイン前提で扱う

## テスト方針

- まずは既存の `users` 系テストを維持する
- 追加 API ごとに成功系と失敗系を用意する
- レスポンスのステータスコードを確認する
- JSON の主要キーを確認する
- DB に依存する処理は、実運用時の接続情報がある前提で検証する

## 完了条件

- DB スキーマが定義書どおりに作成されている
- 主要 API が実装されている
- ユーザー登録、ログイン、商品取得、カート、注文が動作する
- テストが通る
- 仕様書と実装が一致している

## 優先度

### High

- `users`
- `products`
- `product_variants`
- `carts`
- `cart_items`
- `orders`
- `order_items`

### Medium

- `addresses`
- `payments`
- `categories`
- `product_images`

### Low

- クーポン
- レビュー
- お気に入り
- 在庫履歴

## 補足

- 最初は最小構成で進める
- 必要になった機能だけを段階的に追加する
- 仕様変更が入ったら `api-specification.md` と `er-diagram.mmd` も同時に更新する
