import type { Address, User } from "@prisma/client";
import {
  toAddressResponse,
  type AddressResponse,
  type CreateAddressRequest,
  type GetAddressRequest,
  type ListAddressRequest,
  type RemoveAddressRequest,
  type UpdateAddressRequest,
} from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";
import { ExceptionHandler } from "winston";

export class AddressService {
  static async create(
    user: User,
    request: CreateAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.CREATE.parse(request);
    await ContactService.contactMustExist(user, request.contact_id);
    const address = await prismaClient.address.create({
      data: request,
    });

    return toAddressResponse(address);
  }
  static async addressMustExist(
    contactId: number,
    addressId: number
  ): Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where: { id: addressId, contact_id: contactId },
    });

    if (!address) {
      throw new HTTPException(404, { message: "Address not found" });
    }
    return address;
  }

  static async get(
    user: User,
    request: GetAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.GET.parse(request);
    await ContactService.contactMustExist(user, request.contact_id);
    const address = await this.addressMustExist(request.contact_id, request.id);
    return toAddressResponse(address);
  }

  static async update(
    user: User,
    request: UpdateAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.UPDATE.parse(request);
    await ContactService.contactMustExist(user, request.contact_id);
    await this.addressMustExist(request.contact_id, request.id);
    const response = await prismaClient.address.update({
      where: {
        id: request.id,
        contact_id: request.contact_id,
      },
      data: request,
    });
    return toAddressResponse(response);
  }

  static async remove(
    user: User,
    request: RemoveAddressRequest
  ): Promise<boolean> {
    request = AddressValidation.REMOVE.parse(request);
    await ContactService.contactMustExist(user, request.contact_id);
    await this.addressMustExist(request.contact_id, request.id);
    await prismaClient.address.delete({
      where: {
        id: request.id,
        contact_id: request.contact_id,
      },
    });
    return true;
  }

  static async list(
    user: User,
    request: ListAddressRequest
  ): Promise<AddressResponse[]> {
    request = AddressValidation.LIST.parse(request);
    await ContactService.contactMustExist(user, request.contact_id);

    const listAddress = await prismaClient.address.findMany({
      where: {
        contact_id: request.contact_id,
      },
    });
    return listAddress.map((address) => toAddressResponse(address));
  }
}
