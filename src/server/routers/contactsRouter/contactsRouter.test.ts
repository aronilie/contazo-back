import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database/index";
import User from "../../../database/models/User/User";
import { createToken } from "../../../utils/auth/auth";
import { ContactModel } from "../../../database/models/Contact/Contact";

let server: MongoMemoryServer;
let mockToken: string;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const url = server.getUri();
  await connectDB(url);
});

beforeEach(async () => {
  const user = await User.create({
    name: "Dan",
    surname: "Abramov",
    email: "dan@test.com",

    phoneNumber: "+65 782 22 45",
    password: "admin",
    id: "631791f8d7342693105b6908",
  });

  const mockPayload = {
    id: user.id,
    phoneNumber: "888555222",
  };

  mockToken = await createToken(mockPayload);

  const contact = await ContactModel.create({
    name: "Dan",
    surname: "Abramov",
    email: "dan@gmail.com",
    phoneNumber: "888555222",
    owner: user.id,
  });

  user.contacts.push(contact.id);
  user.save();
});

afterEach(async () => {
  await User.deleteMany({});
  await ContactModel.deleteMany();
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  await server.stop();
});

describe("Given the get method in route '/contacts'", () => {
  const route = "/contacts";

  describe("When it receives a request", () => {
    test("Then it should response with status 200 and the contacts", async () => {
      const expectedStatus = 200;

      const { body } = await request(app)
        .get(route)
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(expectedStatus);

      expect(body).toHaveProperty("contacts");
    });
  });

  describe("When it receives a request with method get and an ivalid user token", () => {
    test("Then it should response with status 404 and an object with a property 'destinations'", async () => {
      const expectedStatus = 500;
      const message = "Something went wrong";

      const { body } = await request(app)
        .get(route)
        .set("Authorization", `Bearer #`)
        .expect(expectedStatus);

      expect(body).toHaveProperty("error", message);
    });
  });
});
