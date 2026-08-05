# ルール

このプロジェクトは `Hono` + `Bun` + `Neon` を前提にした API サーバーです。
既存実装に合わせて、変更時は以下の方針を守ってください。

## 基本方針

- 既存の実装スタイルを優先する
- 変更は最小限にする
- JSON のレスポンス形式を崩さない
- エラーメッセージは日本語で統一する
- ルート名、ステータスコード、返却値は既存仕様に合わせる

## 実装方針

- エントリポイントは `index.ts` を基準にする
- 実処理は `api/app.ts` に集約する
- DB 接続は `api/db.ts` または `api/app.ts` の既存方式に合わせる
- 認証やパスワード処理は `bcrypt` を使う
- 環境変数は `process.env` から読む

## API 設計ルール

- API は REST 風のパス設計にする
- ユーザー系のルートは `/users` を起点にする
- 一覧取得は `GET /users`
- 詳細取得は `GET /users/:id`
- 作成は `POST /users/add`
- ログインは `POST /users/login`
- 末尾スラッシュの有無で使い分けが必要なら両対応を検討する
- 成功時は適切な JSON を返す
- バリデーションエラーは `400`
- 未存在リソースは `404`
- 認証失敗は `401`
- 作成成功は `201`

## API 実装ルール

- 入力は `c.req.json()` で受け取る
- パラメータは `c.req.param()` で取得する
- 必須項目は先に検証する
- 検証が落ちたら DB へ問い合わせない
- レスポンスは `c.json()` または `c.text()` を使う
- 一覧取得は配列をそのまま返す
- ログイン成功時は `password` を返さない
- ハッシュ化前のパスワードを保存しない
- SQL はテンプレートリテラルで安全に渡す

## データベース設計ルール

- DB は Neon を利用する
- 接続文字列は `DATABASE_URL` に置く
- `DATABASE_URL` が無い場合は起動時に失敗させる
- ユーザー情報は `users` テーブルに集約する
- 現在の実装では `id`, `name`, `email`, `password` を前提にする
- `email` はログインに使うため一意性を意識する
- `password` は平文保存しない
- 保存時は必ずハッシュ化する
- 取得時は必要なカラムだけ返す設計を意識する

## DB アクセスルール

- 参照は `SELECT`
- 追加は `INSERT ... RETURNING *`
- 条件検索は `WHERE` を使う
- ID 検索は文字列連結せずプレースホルダ経由で渡す
- 失敗時の例外はそのまま握りつぶさず、API 側で適切に扱う

## テストルール
# データベース設計・SQLルール

このプロジェクトは Neon(PostgreSQL) を利用します。

---

# 基本方針

- PostgreSQL の標準機能を利用する
- SQL は可読性を重視する
- テーブル設計は正規化を基本とする
- 必要以上に複雑な SQL を書かない
- トランザクションを適切に利用する

---

# 接続

DATABASE_URL

を利用する

環境変数が無い場合は起動を失敗させる

---

# テーブル設計

主キー

id

UUID または SERIAL

作成日時

created_at

更新日時

updated_at

必要なら

deleted_at

で論理削除する

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

SELECT *

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

RETURNING *

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

- SELECT * を避ける
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
- `api/app.test.ts` の既存パターンに合わせる
- 成功系と失敗系の両方を用意する
- レスポンスのステータスコードと JSON を確認する
- 既存仕様を壊す変更はテストで検出する

## 変更時の確認項目

- ルート名が既存の仕様と一致しているか
- 本番環境で必要な環境変数が揃っているか
- DB スキーマと API の期待値が一致しているか
- パスワードが平文で扱われていないか
- エラー時のステータスコードが適切か
