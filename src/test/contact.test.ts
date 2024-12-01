import { describe, it, expect, afterEach, beforeEach } from "bun:test";
import app from "..";
import { logger } from "../application/logging";
import { ContactTest, UserTest } from "./test.util";
import type { ContactResponse } from "../model/contact-model";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should create contacts", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "test",
        last_name: "hello",
        email: "hello@email.com",
        phone: "9027348374923",
        username: "test",
      }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("test");
  });

  it("should not create new contacts if email invalid", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "test",
        last_name: "hello",
        email: "hello",
        phone: "9027348374923",
        username: "test",
      }),
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/{id}", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });
  it("should get 404 when contact not found", async () => {
    const response = await app.request("/api/contacts/1", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.errors).toBeDefined();
  });

  it("should not create contact when contact is exist", async () => {
    const resp = await ContactTest.create();
    const response = await app.request(`/api/contacts/${resp.id}`, {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe(resp.first_name);
    expect(body.data.last_name).toBe(resp.last_name);
  });
});

describe("PATCH /api/contacts/{id}", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should reject update contact if request is invalid", async () => {
    const resp = await ContactTest.get();
    const response = await app.request(`/api/contacts/${resp.id}`, {
      method: "PATCH",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({ first_name: "" }),
    });
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("should reject update contact if id is not found", async () => {
    const resp = await ContactTest.get();
    const response = await app.request(`/api/contacts/${resp.id + 1}`, {
      method: "PATCH",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({ first_name: "dion" }),
    });
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.errors).toBeDefined();
  });
  it("should success update contact if request is valid", async () => {
    const resp = await ContactTest.get();
    const response = await app.request(`/api/contacts/${resp.id}`, {
      method: "PATCH",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "dion",
        last_name: "test",
        email: "test@email.com",
        phone: "23947394879",
      }),
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("dion");
    expect(body.data.last_name).toBe("test");
  });
});

describe("DELETE /api/contacts/{id}", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });
  it("should failed contact id not found", async () => {
    const resp = await ContactTest.get();
    const response = await app.request(`/api/contacts/${resp.id + 1}`, {
      method: "DELETE",
      headers: {
        Authorization: "test",
      },
    });
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.errors).toBeDefined();
  });

  it("should success contact is exist", async () => {
    const resp = await ContactTest.get();
    const response = await app.request(`/api/contacts/${resp.id}`, {
      method: "DELETE",
      headers: {
        Authorization: "test",
      },
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.success).toBeTruthy();
  });
});
