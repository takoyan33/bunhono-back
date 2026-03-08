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

  // test("name と email がある場合は 201 を返す", async () => {
  //   const res = await app.request("/users/add", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       name: "Taro",
  //       email: `taro+${Date.now()}@example.com`,
  //     }),
  //   });

  //   expect(res.status).toBe(201);

  //   const json = await res.json();
  //   expect(json).toHaveProperty("id");
  //   expect(json).toHaveProperty("name", "Taro");
  //   expect(json).toHaveProperty("email");
  // });
});
