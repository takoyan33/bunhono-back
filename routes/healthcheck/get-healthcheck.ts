import { Hono } from "hono";

export const app = new Hono();

/**
 * API-000
 * GET /healthcheck
 */
app.get("/healthcheck", async (c) => {
  return c.json(
    {
      status: "OK",
      message: "API is running.",
      timestamp: new Date().toISOString(),
    },
    200,
  );
});
