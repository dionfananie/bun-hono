import { Hono } from "hono";
import type { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import type { CreateContactRequest } from "../model/contact-model";
import { ContactService } from "../service/contact-service";

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
