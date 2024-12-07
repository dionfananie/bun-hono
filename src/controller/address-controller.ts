import { Hono } from "hono";
import type { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import type { User } from "@prisma/client";
import type { CreateAddressRequest } from "../model/address-model";
import { AddressService } from "../service/address-service";

export const addressController = new Hono<{
  Variables: ApplicationVariables;
}>();

addressController.use(authMiddleware);

addressController.post("/api/contacts/:id/address", async (c) => {
  const user = c.get("user") as User;
  const contactId = Number(c.req.param("id"));
  const request = (await c.req.json()) as CreateAddressRequest;
  request.contact_id = contactId;

  const response = await AddressService.create(user, request);
  return c.json({
    data: response,
  });
});
