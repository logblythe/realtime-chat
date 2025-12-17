import Elysia from "elysia";
import { redis } from "../../../lib/redis";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const authMiddleware = new Elysia({ name: "auth-middleware" })
  .error({ AuthError })
  .onError(({ code, set }) => {
    if (code === "AuthError") {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  })
  .derive({ as: "scoped" }, async ({ query, cookie }) => {
    const roomId = query.roomId as string;
    const token = cookie["x-auth-token"].value as string;

    if (!roomId || !token) {
      throw new AuthError("Missing roomId or token");
    }

    const connected = await redis.hget<string[]>(`meta:${roomId}`, "connected");

    if (!connected?.includes(token)) {
      throw new AuthError("Invalid token");
    }

    return { auth: { roomId, token, connected } };
  });
