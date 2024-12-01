import type { User } from "@prisma/client";
import {
  toContactResponse,
  type ContactResponse,
  type CreateContactRequest,
  type UpdateContactRequest,
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

  static async checkingUser(user: User, id: number): Promise<ContactResponse> {
    const response = await prismaClient.contact.findUnique({
      where: {
        id,
        username: user.username,
      },
    });
    if (!response) {
      throw new HTTPException(404, {
        message: "contact not found",
      });
    }
    return toContactResponse(response);
  }

  static async get(user: User, id: number): Promise<ContactResponse> {
    id = ContactValidation.GET.parse(id);
    return await this.checkingUser(user, id);
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    request = ContactValidation.UPDATE.parse(request);

    await this.checkingUser(user, request.id);
    const contact = await prismaClient.contact.update({
      where: {
        username: user.username,
        // username: user.username,
        id: request.id,
      },
      data: request,
    });

    return toContactResponse(contact);
  }

  static async delete(user: User, id: number): Promise<boolean> {
    id = ContactValidation.DELETE.parse(id);
    await this.checkingUser(user, id);
    await prismaClient.contact.delete({
      where: {
        username: user.username,
        id: id,
      },
    });
    return true;
  }
}
