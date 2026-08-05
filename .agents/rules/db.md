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
