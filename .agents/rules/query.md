# SELECT クエリ記述ルール

Cloudflare D1（SQLite）環境において、パフォーマンス・安全性・TypeScript の型整合性を維持するための SELECT クエリの記述方針です。

---

## 1. 取得カラムの明示（`SELECT *` の禁止）

### ルール
- **必要なカラムのみ**を明示的に指定して取得します。`SELECT *` の使用は原則禁止です。

### 理由
1. **D1 の課金・パフォーマンス対策**: D1（SQLite）は読み込んだデータ量や行数に応じてパフォーマンスが影響を受けます。不要なデータ（ハッシュ化パスワードや長文テキストなど）の読み込み・転送コストを削減します。
2. **セキュリティリスクの回避**: パスワードハッシュや内部用フラグなどの機密データが、レスポンス JSON へ意図せず漏洩するのを防止します。
3. **スキーマ変更への耐性**: テーブルにカラムが追加された際、想定外のレスポンス構造の変化を防ぎます。

### 記述例

```sql
-- ❌ 悪い例: 不要なパスワードハッシュ等まで取得してしまう
SELECT * FROM users WHERE id = ?;

-- ⭕ 良い例: 必要なカラムのみ明示的に指定する
SELECT id, name, email, created_at FROM users WHERE id = ?;
2. 取得件数に応じた API メソッドの使い分け
D1 渡されるメソッド（.first(), .all(), .raw()）をクエリの期待値に合わせて正しく選択します。

A. 単一行（1件）の取得: .first()
用途: 主キー（ID）検索や UNIQUE カラム（Email 等）による検索など、結果が 1 件または存在しない場合。

挙動: 該当するオブジェクト（または null）を直接返します。配列の先頭を取り出す処理（results[0]）が不要になります。

TypeScript
// ⭕ 単一ユーザーの取得
const user = await c.env.DB
  .prepare("SELECT id, name, email FROM users WHERE id = ?")
  .bind(userId)
  .first<{ id: string; name: string; email: string }>();

if (!user) {
  return c.json({ message: "User not found" }, 404);
}

return c.json(user);
B. 複数行（一覧）の取得: .all()
用途: 一覧取得や条件にマッチする複数レコードの取得。

挙動: { results: T[], success: boolean, meta: ... } オブジェクトを返します。取得結果は results 配列の中に格納されます。

TypeScript
// ⭕ ユーザー一覧の取得
const { results } = await c.env.DB
  .prepare("SELECT id, name, email FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?")
  .bind(limit, offset)
  .all<{ id: string; name: string; email: string }>();

return c.json(results);
3. SQL インジェクション対策（プレースホルダーの徹底）
ルール
動的な値（検索条件、IDなど）をクエリに含める場合は、必ず ?（バインドパラメータ） と .bind() を使用します。

テンプレート文字列（`SELECT * FROM users WHERE id = ${id}`）による文字列結合は厳禁です。

TypeScript
// ❌ 悪い例: SQL インジェクションの脆弱性が発生する
const user = await c.env.DB
  .prepare(`SELECT id, name FROM users WHERE email = '${email}'`)
  .first();

// ⭕ 良い例: プレースホルダーで安全にバインドする
const user = await c.env.DB
  .prepare("SELECT id, name FROM users WHERE email = ?")
  .bind(email)
  .first();
4. 大量データ取得時の保護（LIMIT / OFFSET の必須化）
ルール
全件取得のリスクを避けるため、一覧取得系クエリには原則として LIMIT（および pagination 用の OFFSET）を設定します。

SQL
-- ❌ 悪い例: データ量増加時にメモリ圧迫やレスポンス遅延の原因になる
SELECT id, name, email FROM users;

-- ⭕ 良い例: 上限数を指定して取得する
SELECT id, name, email FROM users ORDER BY id DESC LIMIT 50;
5. TypeScript 型定義（ジェネリクス）の明示
ルール
.first<T>() および .all<T>() の呼び出し時には、取得結果の型（またはインターフェース）をジェネリクスとして指定し、型安全性を確保します。

TypeScript
type UserResponse = {
  id: number;
  name: string;
  email: string;
};

// 型安全に D1 から取得する
const user = await c.env.DB
  .prepare("SELECT id, name, email FROM users WHERE id = ?")
  .bind(userId)
  .first<UserResponse>();
// user は UserResponse | null 型になる