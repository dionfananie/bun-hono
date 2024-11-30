import { describe, it, expect, afterEach, beforeEach } from "bun:test";
import app from "..";
import { logger } from "../application/logging";
import { UserTest } from "./test.util";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject register new user if request is invalid", async () => {
    const resp = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "",
        password: "",
        name: "",
      }),
    });
    const body = await resp.json();
    logger.debug(body);
    expect(resp.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("should reject register new user if username already exists", async () => {
    await UserTest.create();

    const response = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "test",
        password: "test",
        name: "test",
      }),
    });
    const body = await response.json();
    logger.debug(body);
    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("should register new user success", async () => {
    const response = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "test",
        password: "test",
        name: "test",
      }),
    });
    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.username).toBe("test");
    expect(body.data.name).toBe("test");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to login", async () => {
    const resp = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "test",
        password: "test",
      }),
    });
    const body = await resp.json();
    logger.debug(body);
    expect(resp.status).toBe(200);
    expect(body.data.token).toBeDefined();
  });

  it("should be rejected if username is wrong", async () => {
    const response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "hehe",
        password: "test",
      }),
    });
    const body = await response.json();
    logger.debug(body);
    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("should be rejected if password is wrong", async () => {
    const response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "test",
        password: "hoho",
      }),
    });
    const body = await response.json();
    logger.debug(body);
    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });
});
