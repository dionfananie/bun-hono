import { Hono } from "hono";
import type {
  LoginUserRequest,
  RegisterUserRequest,
} from "../model/user-mode.l";
import { Userservice } from "../service/user-service";

export const userController = new Hono();

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
