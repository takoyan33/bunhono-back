import { describe, test, expect } from "bun:test";
import { app } from "./app";

describe("POST /users/add", () => {
  test("name または email がない場合は 400 を返す", async () => {
    const res = await app.request("/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Taro" }),
    });

    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json).toEqual({ message: "name と email は必須です" });
  });
});
