1. DB（スキーマ）に変更がある場合
先に D1 にマイグレーションを適用してから Worker をデプロイします。

Bash
# ① 本番 D1 にマイグレーションを適用
bunx wrangler d1 migrations apply my-hono-api --remote

# ② Worker をデプロイ
bunx wrangler deploy
2. コード（TypeScript）のみの変更の場合
DB に変更がない場合は、デプロイコマンドのみで完了します。

Bash
bunx wrangler deploy