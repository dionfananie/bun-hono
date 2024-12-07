import { Hono } from "hono";
import type { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import type { User } from "@prisma/client";
import type {
  CreateAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from "../model/address-model";
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

addressController.get("/api/contacts/:id/address/:addressId", async (c) => {
  const user = c.get("user") as User;
  const contactId = Number(c.req.param("id"));
  const addressId = Number(c.req.param("addressId"));

  const request: GetAddressRequest = {
    contact_id: contactId,
    id: addressId,
  };

  const response = await AddressService.get(user, request);
  return c.json({
    data: response,
  });
});

addressController.put("/api/contacts/:id/address/:addressId", async (c) => {
  const user = c.get("user") as User;
  const contactId = Number(c.req.param("id"));
  const addressId = Number(c.req.param("addressId"));
  const request = (await c.req.json()) as UpdateAddressRequest;
  request.id = addressId;
  request.contact_id = contactId;

  const response = await AddressService.update(user, request);
  return c.json({
    data: response,
  });
});

addressController.delete("/api/contacts/:id/address/:addressId", async (c) => {
  const user = c.get("user") as User;
  const contactId = Number(c.req.param("id"));
  const addressId = Number(c.req.param("addressId"));
  const request = (await c.req.json()) as UpdateAddressRequest;
  request.id = addressId;
  request.contact_id = contactId;

  const response = await AddressService.remove(user, request);
  return c.json({
    data: response,
  });
});
