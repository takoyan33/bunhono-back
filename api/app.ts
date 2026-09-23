import { Hono } from "hono";
import { app as healthcheck } from "../routes/healthcheck/get-healthcheck";
import { app as getUsers } from "../routes/users/get-users";
import { app as getUserById } from "../routes/users/get-users-id";
import { app as addUser } from "../routes/users/post-users-add";
import { app as loginUser } from "../routes/users/post-users-login";
import { app as getAddresses } from "../routes/addresses/get-addresses";
import { app as addAddress } from "../routes/addresses/post-addresses";
import { app as getProducts } from "../routes/products/get-products";
import { app as getProductById } from "../routes/products/get-products-id";
import { app as getCartsMe } from "../routes/carts/get-carts-me";
import { app as addCartItem } from "../routes/carts/post-carts-item";
import { app as patchCartsItem } from "../routes/carts/patch-carts-item";
import { app as deleteCartsItem } from "../routes/carts/delete-carts-item";

export const app = new Hono();

// API-000 /healthcheck ヘルスチェック
app.route("/", healthcheck);

// API番号なし GET /users ユーザー一覧取得
app.route("/", getUsers);

// API番号なし GET /users/:id ユーザー詳細取得
app.route("/", getUserById);

// API-001 POST /users/add ユーザー新規登録
app.route("/", addUser);

// API-002 POST /users/login ログイン
app.route("/", loginUser);

// API-003 GET /addresses 住所一覧取得
app.route("/", getAddresses);

// API-004 POST /addresses 住所登録
app.route("/", addAddress);

// API-005 GET /products 商品一覧取得
app.route("/", getProducts);

// API-006 GET /products/:id 商品詳細取得
app.route("/", getProductById);

// API-007 GET /carts/me カート取得
app.route("/", getCartsMe);

// API-008 POST /carts/items カートへ商品追加
app.route("/", addCartItem);

// API-009 PATCH /carts/item/:id カート商品の数量更新
app.route("/", patchCartsItem);

// API-010 DELETE /carts/item/:id カート商品の削除
app.route("/", deleteCartsItem);
