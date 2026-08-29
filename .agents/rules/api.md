# API 設計ルール

このドキュメントは REST API を実装する際の共通ルールをまとめたものです。

---

# 基本方針

- REST を基本とする
- URL は名詞を利用する
- URL に動詞を書きすぎない
- API の命名を統一する
- レスポンス形式を統一する
- ステータスコードを正しく利用する
- 後方互換性を意識する

---

# URL 設計

リソースは複数形にする

/users

/products

/orders

カテゴリなども同様

/categories

---

# HTTP メソッド

GET

取得

POST

新規作成

PUT

全更新

PATCH

部分更新

DELETE

削除

---

# 一覧取得

GET /users

配列を返す

---

# 詳細取得

GET /users/:id

存在しなければ404

---

# 作成

POST /users

または既存仕様に合わせ

POST /users/add

作成成功は201

---

# 更新

PUT /users/:id

または

PATCH /users/:id

---

# 削除

DELETE /users/:id

---

# ログイン

POST /users/login

成功時は password を返さない

---

# JSON

リクエスト

Content-Type

application/json

レスポンス

application/json

---

# バリデーション

DB より前に行う

- 必須項目
- 型
- 文字数
- メール形式
- 数値範囲
- Enum

---

# エラー

全てのパターンを網羅する必要はない。

200 OK リクエストは成功しレスポンスとともに要求に応じたリソースが返される。
201 CREATED リクエストは完了し新たにリソースが作成された。Locationヘッダには新たに作成されたリソースのURIが含まれる。POSTで利用される。
204 NO CONTENT 内容なし。リクエストを受理したが、返すべきレスポンスエンティティが存在しない場合に返される。PUT、POST、DELETE等で利用される。
303 SEE OTHER 他を参照せよ。リクエストに対するレスポンスが他のURIとして存在するときに返される。Locationヘッダに移動先のURIが示されている。
400 BAD REQUEST リクエストが不正である。定義されていないメソッドを使うなど、クライアントのリクエストがおかしい場合に返される。
401 UNAUTHORIZED 認証が必要である。Basic認証やDigest認証などを行うときに使用される。
404 NOT FOUND 未検出。リソースが見つからなかった。
405 METHOD NOT ALLOWED 許可されていないメソッド。許可されていないメソッドを使用しようとした。
409 CONFLICT 競合。リクエストは現在のリソースと競合するので完了出来ない。
500 INTERNAL SERVER ERROR サーバ内部エラー。サーバ内部にエラーが発生した場合に返される。
503 SERVICE UNAVAILABLE サービス利用不可。サービスが一時的に過負荷やメンテナンスで使用不可能である。
---

# エラーレスポンス

形式を統一する

{
"message": "ユーザーが存在しません"
}

または

{
"error": "メールアドレスが不正です"
}

---

# セキュリティ

- password を返さない
- token をログへ出さない
- SQL Injection を防ぐ
- XSS を意識する
- CSRF が必要なら導入する
- 入力値を信用しない

---

# ページネーション

一覧 API は必要に応じて

page

limit

offset

cursor

などを利用する

---

# ソート

sort

order

asc

desc

を利用する

---

# フィルタ

クエリパラメータで行う

例

GET /products?status=published

---

# バージョニング

必要なら

/v1/users

のように管理する

---

# 後方互換性

- 既存レスポンスを不用意に変更しない
- フィールド削除は慎重に行う
- 新規フィールド追加を優先する

---

# テスト

最低限

- 成功
- 入力エラー
- 404
- 401
- 500

を確認する
