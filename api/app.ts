import { Hono } from "hono";
import { app as healthcheck } from "../routes/healthcheck/get-healthcheck";
import { app as getUsers } from "../routes/users/get-users";
import { app as getUserById } from "../routes/users/get-users-id";
import { app as addUser } from "../routes/users/post-users-add";
import { app as loginUser } from "../routes/users/post-users-login";
import { app as getAddresses } from "../routes/addresses/get-addresses";
import { app as getProducts } from "../routes/products/get-products";
import { app as getProductById } from "../routes/products/get-products-id";
import { app as getCartsMe } from "../routes/carts/get-carts-me";

export const app = new Hono();

// API-000 /healthcheck ヘルスチェック
app.route("/", healthcheck);

// API-001 GET /users ユーザー一覧取得
app.route("/", getUsers);

// API-002 GET /users/:id ユーザー詳細取得
app.route("/", getUserById);

// API-003 POST /users/add ユーザー新規登録
app.route("/", addUser);

// API-004 POST /users/login ログイン
app.route("/", loginUser);

// API-005 GET /addresses 住所一覧取得
app.route("/", getAddresses);

// API-006 GET /products 商品一覧取得
app.route("/", getProducts);

// API-007 GET /products/:id 商品詳細取得
app.route("/", getProductById);

// API-008 GET /carts/me カート取得
app.route("/", getCartsMe);
