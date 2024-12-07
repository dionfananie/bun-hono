import { describe, it, expect, afterEach, beforeEach } from "bun:test";
import app from "..";
import { AddressTest, ContactTest, UserTest } from "./test.util";

describe("POST /api/contacts/:id/address", () => {
  beforeEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if request is not valid ", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(
      "/api/contacts/" + contact.id + "/address",
      {
        method: "POST",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          country: "",
          postal_code: "",
        }),
      }
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });
  it("should rejected if request is not found ", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(
      "/api/contacts/" + contact.id + 1 + "/address",
      {
        method: "POST",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          country: "",
          postal_code: "",
        }),
      }
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });
  it("should success if request is valid ", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(
      "/api/contacts/" + contact.id + "/address",
      {
        method: "POST",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          country: "ID",
          street: "Jl Sabang",
          province: "Java",
          postal_code: "278346",
        }),
      }
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.street).toBe("Jl Sabang");
    expect(body.data.province).toBe("Java");
    expect(body.data.country).toBe("ID");
    expect(body.data.postal_code).toBe("278346");
  });
});

describe("GET /api/contacts/:id/address/:addressId", () => {
  beforeEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();

    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if address not found ", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await app.request(
      "/api/contacts/" + contact.id + "/address/" + (address.id + 1),
      {
        method: "GET",
        headers: {
          Authorization: "test",
        },
      }
    );
    console.log("response: ", response);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should rejected if request is not found ", async () => {});
  it("should success if request is valid ", async () => {
    //   const contact = await ContactTest.get();
    //   const response = await app.request(
    //     "/api/contacts/" + contact.id + "/address",
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: "test",
    //       },
    //       body: JSON.stringify({
    //         country: "ID",
    //         street: "Jl Sabang",
    //         province: "Java",
    //         postal_code: "278346",
    //       }),
    //     }
    //   );
    //   expect(response.status).toBe(200);
    //   const body = await response.json();
    //   expect(body.data.street).toBe("Jl Sabang");
    //   expect(body.data.province).toBe("Java");
    //   expect(body.data.country).toBe("ID");
    //   expect(body.data.postal_code).toBe("278346");
  });
});
