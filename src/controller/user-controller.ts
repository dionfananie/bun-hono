import { Hono } from "hono";
import {
  toUserResponse,
  type LoginUserRequest,
  type RegisterUserRequest,
  type UpdateUserRequest,
} from "../model/user-model";
import { Userservice } from "../service/user-service";
import type { ApplicationVariables } from "../model/app-model";
import type { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth-middleware";

export const userController = new Hono<{ Variables: ApplicationVariables }>();

userController.post("/api/users", async (c) => {
  const request = (await c.req.json()) as RegisterUserRequest;

  const response = await Userservice.register(request);

  return c.json({ data: response });
});

userController.post("/api/users/login", async (c) => {
  const request = (await c.req.json()) as LoginUserRequest;
  const response = await Userservice.login(request);

  return c.json({ data: response });
});

userController.use(authMiddleware);

userController.get("/api/users/current", async (c) => {
  const user = c.get("user") as User;
  return c.json({
    data: toUserResponse(user),
  });
});

userController.patch("/api/users/current", async (c) => {
  const user = c.get("user") as User;
  const request = (await c.req.json()) as UpdateUserRequest;
  const response = await Userservice.update(user, request);
  return c.json({
    data: response,
  });
});

userController.delete("/api/users/current", async (c) => {
  const user = c.get("user") as User;
  const response = await Userservice.logout(user);
  return c.json({
    data: {
      success: response,
    },
  });
});
