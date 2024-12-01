import { Hono } from "hono";
import type { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import type {
  CreateContactRequest,
  UpdateContactRequest,
} from "../model/contact-model";
import { ContactService } from "../service/contact-service";
import type { User } from "@prisma/client";

export const contactController = new Hono<{
  Variables: ApplicationVariables;
}>();

contactController.use(authMiddleware);

contactController.post("/api/contacts", async (c) => {
  const request = (await c.req.json()) as CreateContactRequest;
  const user = c.get("user");
  const response = await ContactService.create(user, request);
  return c.json({
    data: response,
  });
});

contactController.get("/api/contacts/:id", async (c) => {
  const user = c.get("user");
  const { id } = c.req.param();
  const response = await ContactService.get(user, Number(id));
  return c.json({
    data: response,
  });
});

contactController.patch("/api/contacts/:id", async (c) => {
  const user = c.get("user");
  const { id } = c.req.param();
  const req = (await c.req.json()) as UpdateContactRequest;
  req.id = Number(id);
  const response = await ContactService.update(user, req);
  return c.json({
    data: response,
  });
});

contactController.delete("/api/contacts/:id", async (c) => {
  const user = c.get("user") as User;
  const { id } = c.req.param();
  const response = await ContactService.delete(user, Number(id));
  return c.json({
    data: { success: response },
  });
});
