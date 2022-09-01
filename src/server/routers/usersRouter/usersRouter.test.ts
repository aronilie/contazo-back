import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database/index";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const mongoURL = server.getUri();

  await connectDB(mongoURL);
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

describe("Given the POST endpoint /users/register", () => {
  describe("When it receives a request with phoneNumber '+65 782 22 45' and password 'admin'", () => {
    test("Then it should response with status 201 and the user data", async () => {
      const user = { phoneNumber: "+65 782 22 45", password: "admin" };
      const expectedStatus = 201;

      const response = await request(app)
        .post("/users/register")
        .send(user)
        .expect(expectedStatus);
      expect(response.statusCode).toEqual(expectedStatus);
    });
  });
});
