# データベース設計・SQLルール

このプロジェクトは PostgreSQL を利用します。

---

# 基本方針

- Cloudflare D1（SQLite 互換）の標準機能を利用する
- SQL は可読性を重視し、プレースホルダー（`?`）を徹底する
- テーブル設計は正規化を基本とする
- D1 の従量課金（走査行数）を意識し、`SELECT *` を避けてインデックスを適切に設定する
- データベース操作は環境変数ではなく、Worker の `c.env.DB` バインディングを介して実行する

---

# 接続・バインディング

- `c.env.DB`（`D1Database`）を利用する
- `DATABASE_URL` などの接続文字列は利用しない
- ローカル環境では `wrangler.jsonc` の D1 バインディング設定に基づいて `wrangler dev` 上で動作させる

---

# テーブル設計

### 主なカラム構成

| カラム名     | 説明         | 推奨型                                                   |
| ------------ | ------------ | -------------------------------------------------------- |
| `id`         | 主キー       | `TEXT` (UUID) または `INTEGER PRIMARY KEY AUTOINCREMENT` |
| `created_at` | 作成日時     | `TEXT` (`DEFAULT (CURRENT_TIMESTAMP)`)                   |
| `updated_at` | 更新日時     | `TEXT`                                                   |
| `deleted_at` | 論理削除日時 | `TEXT` (必要に応じて設定)                                |

---

# 命名規則

- **テーブル名**: 小文字の複数形 (`users`, `products`, `orders`)
- **カラム名**: `snake_case` (`created_at`, `updated_at`, `user_id`)

---

# データ型（D1 / SQLite 互換）

SQLite のストレージクラス（`TEXT`, `INTEGER`, `REAL`, `BLOB`）に準拠します。

| データ種別    | 設定する型 | 補足                                                        |
| ------------- | ---------- | ----------------------------------------------------------- |
| 文字列 / UUID | `TEXT`     | メールアドレス、UUID、テキスト全般                          |
| 金額 / 数量   | `INTEGER`  | 小数点を扱う場合は `REAL` または最小単位（銭/分）で整数管理 |
| 日時          | `TEXT`     | ISO8601 形式の文字列（例: `2026-08-22T08:00:00Z`）          |
| 真偽値        | `INTEGER`  | `0` (false) または `1` (true)                               |

---

# 制約

必要に応じて以下を設定し、データ整合性を保ちます。

- `PRIMARY KEY`
- `UNIQUE`
- `NOT NULL`
- `CHECK`
- `FOREIGN KEY` (外部キー制約)

---

# セキュリティルール

### email

- `UNIQUE` 制約を付与する

### password

- 平文保存は絶対禁止
- Cloudflare Workers 互換の `bcryptjs` 等を用いてハッシュ化した文字列のみを保存する

### SQL Injection 対策

- **文字列連結・テンプレート文字列による埋め込みは絶対禁止**
- 必ず D1 の `.prepare().bind(...)` プレースホルダー（`?`）を利用する

---

# 命名規則

テーブル

複数形

users

products

orders

カラム

snake_case

created_at

updated_at

user_id

---

# データ型

文字列

TEXT

可変長文字

VARCHAR

金額

INTEGER

BIGINT

DECIMAL

日時

TIMESTAMP

真偽値

BOOLEAN

UUID

UUID

---

# 制約

必要に応じて

PRIMARY KEY

UNIQUE

NOT NULL

CHECK

FOREIGN KEY

を設定する

---

# email

UNIQUE を付与する

---

# password

平文保存禁止

bcrypt のハッシュのみ保存

---

# SQL

SELECT

必要なカラムだけ取得する

悪い例

SELECT \*

良い例

SELECT
id,
name,
email

FROM users

---

# INSERT

RETURNING を利用する

INSERT ...

RETURNING \*

---

# UPDATE

更新対象を限定する

WHERE を忘れない

---

# DELETE

WHERE を忘れない

必要なら論理削除を利用する

---

# SQL Injection

必ずプレースホルダを利用する

文字列連結は禁止

---

# インデックス

検索されるカラム

JOIN

WHERE

ORDER BY

に適切に設定する

例

email

created_at

user_id

---

# トランザクション

複数テーブル更新時は利用する

途中失敗なら ROLLBACK

---

# NULL

意味がある場合のみ利用する

NOT NULL を基本とする

---

# 外部キー

必要に応じて設定する

整合性を保つ

---

# パフォーマンス

- SELECT \* を避ける
- 必要なインデックスを付ける
- N+1 を避ける
- LIMIT を活用する
- EXPLAIN で確認する

---

# マイグレーション

- スキーマ変更はマイグレーションで管理する
- 本番 DB を直接変更しない
- 差分管理を行う

---

# エラー処理

DB エラーは握りつぶさない

API 層で適切なステータスコードへ変換する

---

# テスト

確認項目

- INSERT
- SELECT
- UPDATE
- DELETE
- UNIQUE 制約
- FOREIGN KEY
- NOT NULL
- トランザクション
- SQL Injection 対策