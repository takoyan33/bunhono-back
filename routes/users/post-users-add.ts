import { Hono } from "hono";
import { hash } from "bcrypt";
import sql from "../../api/db";

export const app = new Hono();

app.post("/users/add", async (c) => {
  const body = await c.req.json();
  const name: string = body["name"];
  const email: string = body["email"];
  const password: string = body["password"];

  if (!name) {
    return c.json({ message: "name は必須です" }, 400);
  }
  if (!email) {
    return c.json({ message: "email は必須です" }, 400);
  }
  if (!password) {
    return c.json({ message: "password は必須です" }, 400);
  }

  const hashedPassword = await hash(password, 10);
  const users =
    await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword}) RETURNING *`;

  return c.json(users[0], 201);
});
