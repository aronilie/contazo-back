import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database/index";
import User from "../../../database/models/User/User";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const url = server.getUri();
  await connectDB(url);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  await server.stop();
});

describe("Given the POST endpoint /users/register", () => {
  describe("When it receives a request with phoneNumber '+65 782 22 45' and password 'admin'", () => {
    test("Then it should response with status 201 and the user data", async () => {
      const user = { phoneNumber: "+65 782 22 45", password: "admin" };
      const route = "/users/register";
      const expectedStatus = 201;

      await request(app).post(route).send(user).expect(expectedStatus);
    });
  });

  describe("When it receives a request without password", () => {
    test("Then it should response with status 400 and a message 'Wrong data'", async () => {
      const message = "Wrong data";
      const { body } = await request(app)
        .post("/users/register")
        .send({
          phoneNumber: "",
        })
        .expect(400);

      expect(body).toHaveProperty("error", message);
    });
  });
});

describe("Given the POST endpoint is /users/login", () => {
  describe("When it receives a request with phoneNumber '+65 782 22 45' and password 'admin'", () => {
    test("Then it should response with status 200 and the token created", async () => {
      const user = { phoneNumber: "+65 782 22 45", password: "admin" };
      const userLogin = { phoneNumber: "+65 782 22 45", password: "admin" };
      const route = "/users/login";
      const expectedStatus = 200;

      await request(app).post("/users/register").send(user).expect(201);
      await request(app).post(route).send(userLogin).expect(expectedStatus);
    });
  });

  describe("When it receives a request without password", () => {
    test("Then it should response with status 400 and a message 'Wrong data'", async () => {
      const message = "Wrong data";
      const { body } = await request(app)
        .post("/users/login")
        .send({
          phoneNumber: "",
        })
        .expect(400);

      expect(body).toHaveProperty("error", message);
    });
  });
});
