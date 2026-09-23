# API 開発進捗チェックシート

`docs/api-specification.md` の仕様に基づいたAPIの実装状況トラッキング用チェックシートです。

## 仕様書に定義されているAPI

- [x] **API-000** : ヘルスチェック (`GET /healthcheck` ※現状は `GET /` で実装)
- [x] **API-001** : ユーザー新規登録 (`POST /users/add`)
- [x] **API-002** : ログイン (`POST /users/login`)
- [x] **API-003** : 住所一覧取得 (`GET /addresses`)
- [x] **API-004** : 住所登録 (`POST /addresses`)
- [x] **API-005** : 商品一覧取得 (`GET /products`)
- [x] **API-006** : 商品詳細取得 (`GET /products/:id`)
- [x] **API-007** : カート取得 (`GET /carts/me`)
- [x] **API-008** : カートへ商品追加 (`POST /carts/items`)
- [x] **API-009** : カート商品の数量更新 (`PATCH /carts/item/:id`)
- [x] **API-010** : カート商品削除 (`DELETE /carts/item/:id`)
- [ ] **API-011** : 注文作成 (`POST /orders`)
- [ ] **API-012** : 注文一覧取得 (`GET /orders`)
- [ ] **API-013** : 注文詳細取得 (`GET /orders/:id`)
- [ ] **API-014** : 決済情報作成 (`POST /payments`)

---

## 仕様書外（独自実装済み）

実装されているが仕様書に記載がないAPIです。必要であれば仕様書側にも追記してください。
- [x] **(API番号なし)** : ユーザー一覧取得 (`GET /users`)
- [x] **(API番号なし)** : ユーザー詳細取得 (`GET /users/:id`)

---

**更新日**: 2026-09-21
