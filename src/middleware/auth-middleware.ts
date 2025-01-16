import type { Context, MiddlewareHandler } from "hono";
import { Userservice } from "../service/user-service";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header("Authorization");
  const user = await Userservice.get(token);
  c.set("user", user);
  await next();
};
