import type { Context } from "hono";
import type { UserResponse } from "../../model/user-model";

export const UserResolver = {
  Query: {
    user: async (_: any, __: any, c: Context) => {
      const user: UserResponse = c.get("user");

      return { name: user.name, username: user.username };
    },
  },
};
