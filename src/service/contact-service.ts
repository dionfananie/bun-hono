import type { Contact, User } from "@prisma/client";
import {
  toContactResponse,
  type ContactResponse,
  type CreateContactRequest,
  type SearchContactRequest,
  type UpdateContactRequest,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";
import type { Pageable } from "../model/page-model";

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

  static async search(
    user: User,
    request: SearchContactRequest
  ): Promise<Pageable<ContactResponse>> {
    request = ContactValidation.SEARCH.parse(request);

    const filter = [];

    if (request.name) {
      filter.push({
        OR: [
          {
            first_name: {
              contains: request.name,
            },
          },
          {
            last_name: {
              contains: request.name,
            },
          },
          {},
        ],
      });
    }
    if (request.email) {
      filter.push({
        email: {
          contains: request.email,
        },
      });
    }
    if (request.phone) {
      filter.push({
        phone: {
          contains: request.email,
        },
      });
    }

    const skip = (request.page - 1) * request.size;
    const contacts = await prismaClient.contact.findMany({
      where: {
        username: user.username,
        AND: filter,
      },
      take: request.size,
      skip,
    });
    const total = await prismaClient.contact.count({
      where: {
        username: user.username,
        AND: filter,
      },
    });
    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        current_page: request.page,
        size: request.size,
        total_page: Math.ceil(total / request.size),
      },
    };
    // return response;
  }
}
