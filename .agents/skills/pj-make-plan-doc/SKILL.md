---

name: "pj-make-doc-code"
description: API 設計書を作成し、それを元に実装する

---

# pj-make-doc-code

**このファイルは手順・原則のみ。詳細・コード例は reference.md に書く。**

## 1. データベース定義書の作成

`pj-make-doc-code "内容"` を参考に `docs/database-definition.md` を作成する。

- テーブル一覧
- カラム定義
- 型
- 制約
- インデックス

作成後はユーザーにレビューを依頼し、承認を得てから次のステップへ進む。

## 2. API 仕様書・ER 図の作成

`pj-make-doc-code "内容"` を参考に以下を作成する。

- `docs/api-specification.md`
- `docs/er-diagram.md`

API 仕様書には以下を含める。

- エンドポイント一覧
- Request
- Response
- バリデーション
- エラー仕様

ER 図にはテーブル間のリレーションを明記する。

作成後はユーザーにレビューを依頼し、承認を得てから次のステップへ進む。

## 3. 実装計画書の作成

`pj-make-doc-code "内容"` を参考に `docs/implementation-plan.md` を作成する。

以下を明記する。

- 実装順序
- ディレクトリ構成
- DB 実装方針
- API 実装方針
- テスト方針
- 完了条件

作成後はユーザーにレビューを依頼し、承認を得てから次のステップへ進む。

## 4. DB 作成・API 実装・テスト作成

実装計画書をもとに以下を実施する。

### DB 作成

- マイグレーション作成
- テーブル作成
- 初期データ作成（必要な場合）

### API 実装

- Repository 層実装
- Service 層実装
- API Route 実装
- バリデーション実装
- エラーハンドリング実装

### テスト作成

- Unit Test
- Integration Test
- API Test

### 完了後

- テストを実行し成功を確認する
- Linter・Formatter を実行する
- 実装内容をまとめてユーザーへ報告する
