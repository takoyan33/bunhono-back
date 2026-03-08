import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";

export const app = new Hono();

const sql = neon(process.env.DATABASE_URL!);

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

app.get("/users", async (c) => {
  const users = await sql`SELECT * FROM users`;
  return c.json(users);
});

app.get("/users/:id", async (c) => {
  const id = c.req.param("id");
  const users = await sql`SELECT * FROM users WHERE id = ${id}`;
  return c.json(users);
});

app.post("/users/add", async (c) => {
  const body = await c.req.parseBody();
  const name = body["name"];
  const email = body["email"];

  if (!name || !email) {
    return c.json({ message: "name と email は必須です" }, 400);
  }

  const users =
    await sql`INSERT INTO users (name, email) VALUES (${name}, ${email}) RETURNING *`;

  return c.json(users[0], 201);
});
