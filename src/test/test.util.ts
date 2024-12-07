import type { Address, Contact } from "@prisma/client";
import { prismaClient } from "../application/database";

export class UserTest {
  static async create() {
    await prismaClient.user.create({
      data: {
        username: "test",
        name: "test",
        password: await Bun.password.hash("test", {
          algorithm: "bcrypt",
          cost: 10,
        }),
        token: "test",
      },
    });
  }

  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }
}

export class ContactTest {
  static async create(): Promise<Contact> {
    const resp = await prismaClient.contact.create({
      data: {
        first_name: "test",
        last_name: "hello",
        email: "hello@email.com",
        phone: "9027348374923",
        username: "test",
      },
    });
    return resp;
  }

  static async get(): Promise<Contact> {
    const resp = await prismaClient.contact.findFirstOrThrow({
      where: { username: "test" },
    });
    return resp;
  }
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  static async createMany(n: number) {
    for (let i = 0; i < n; i++) {
      await this.create();
    }
  }
}

export class AddressTest {
  static async deleteAll() {
    await prismaClient.address.deleteMany({
      where: {
        contact: {
          username: "test",
        },
      },
    });
  }
  static async create() {
    const contact = await ContactTest.get();
    await prismaClient.address.create({
      data: {
        contact_id: contact.id,
        street: "Jalan",
        city: "Kota",
        province: "Provinsi",
        country: "Indonesia",
        postal_code: "12345",
      },
    });
  }

  static async get(): Promise<Address> {
    return await prismaClient.address.findFirstOrThrow({
      where: {
        contact: {
          username: "test",
        },
      },
    });
  }
}
