import { describe, test, expect } from "bun:test";
import { app } from "./app";

describe("POST /users/add", () => {
  test("name がない場合は 400 を返す", async () => {
    const res = await app.request("/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "password123" }),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ message: "name は必須です" });
  });

  test("email がない場合は 400 を返す", async () => {
    const res = await app.request("/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Taro", password: "password123" }),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ message: "email は必須です" });
  });

  test("password がない場合は 400 を返す", async () => {
    const res = await app.request("/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Taro", email: "taro@example.com" }),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ message: "password は必須です" });
  });

  test("すべての項目が正しく送信された場合は 201 を返す", async () => {
    const uniqueEmail = `taro+${Date.now()}@example.com`;
    const res = await app.request("/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Taro",
        email: uniqueEmail,
        password: "password123"
      }),
    });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toHaveProperty("id");
    expect(json).toHaveProperty("name", "Taro");
    expect(json).toHaveProperty("email", uniqueEmail);
    expect(json).toHaveProperty("password");
  });
});

describe("POST /users/login", () => {
  test("email または password がない場合は 400 を返す", async () => {
    const res = await app.request("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ message: "email と password は必須です" });
  });

  test("存在しないユーザーの場合は 404 を返す", async () => {
    const res = await app.request("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `notfound+${Date.now()}@example.com`, password: "password123" }),
    });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({ message: "ユーザーが見つかりません" });
  });

  test("パスワードが間違っている場合は 401 を返す", async () => {
    const uniqueEmail = `login+${Date.now()}@example.com`;
    await app.request("/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "LoginUser", email: uniqueEmail, password: "password123" }),
    });

    const res = await app.request("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: uniqueEmail, password: "wrongpassword" }),
    });
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({ message: "パスワードが間違っています" });
  });

  test("ログインが成功した場合は 200 を返す", async () => {
    const uniqueEmail = `success+${Date.now()}@example.com`;
    await app.request("/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "SuccessUser", email: uniqueEmail, password: "password123" }),
    });

    const res = await app.request("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: uniqueEmail, password: "password123" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("message", "ログイン成功");
    expect(json.user).toHaveProperty("name", "SuccessUser");
    expect(json.user).toHaveProperty("email", uniqueEmail);
    expect(json.user).not.toHaveProperty("password");
  });
});
