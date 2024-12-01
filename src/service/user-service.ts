import type { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import {
  toUserResponse,
  type LoginUserRequest,
  type RegisterUserRequest,
  type UpdateUserRequest,
  type UserResponse,
} from "../model/user-mode.l";
import { UserValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception";

export class Userservice {
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    request = UserValidation.REGISTER.parse(request);
    const totalUser = await prismaClient.user.count({
      where: {
        username: request.username,
      },
    });

    if (totalUser !== 0) {
      throw new HTTPException(400, { message: "Username already exists" });
    }
    request.password = await Bun.password.hash(request.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const user = await prismaClient.user.create({
      data: request,
    });

    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    request = UserValidation.LOGIN.parse(request);
    let user = await prismaClient.user.findUnique({
      where: {
        username: request.username,
      },
    });

    if (!user) {
      throw new HTTPException(401, {
        message: "Username or Password is wrong",
      });
    }
    const isPasswordValid = await Bun.password.verify(
      request.password,
      user.password,
      "bcrypt"
    );

    if (!isPasswordValid) {
      throw new HTTPException(401, {
        message: "Username or Password is wrong",
      });
    }
    user = await prismaClient.user.update({
      where: {
        username: request.username,
      },
      data: {
        token: crypto.randomUUID(),
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }

  static async get(token: string | undefined): Promise<User> {
    const result = UserValidation.TOKEN.safeParse(token);
    if (result.error) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }
    const user = await prismaClient.user.findFirst({
      where: {
        token,
      },
    });

    if (!user) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }
    return user;
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    request = UserValidation.UPDATE.parse(request);

    if (request.name) {
      user.name = request.name;
    }
    if (request.password) {
      user.password = await Bun.password.hash(request.password, {
        algorithm: "bcrypt",
        cost: 10,
      });
    }

    user = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return toUserResponse(user);
  }
}
