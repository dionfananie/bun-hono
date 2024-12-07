import type { User } from "@prisma/client";
import {
  toAddressResponse,
  type AddressResponse,
  type CreateAddressRequest,
} from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";

export class AddressService {
  static async create(
    user: User,
    request: CreateAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.CREATE.parse(request);
    await ContactService.checkingUser(user, request.contact_id);
    const address = await prismaClient.address.create({
      data: request,
    });

    return toAddressResponse(address);
  }
}
