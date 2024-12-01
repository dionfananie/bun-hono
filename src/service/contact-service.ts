import type { User } from "@prisma/client";
import type {
  ContactResponse,
  CreateContactRequest,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    request = ContactValidation.CREATE.parse(request);
    const response = await prismaClient.contact.create({
      data: {
        ...request,
        username: user.username,
      },
    });

    return response;
  }

  static async get(user: User, id: number) {
    const response = await prismaClient.contact.findUnique({
      where: {
        id,
      },
    });
    if (!response) {
      throw new HTTPException(404, {
        message: "contact not found",
      });
    }
    return response;
  }
}
