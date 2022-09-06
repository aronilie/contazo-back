import { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User/User";
import UserRegister from "../../../interfaces/UserRegister";
import CustomError from "../../../utils/CustomError/CustomError";
import registerUser, { loginUser } from "./usersController";

let mockHashCompare = true;

jest.mock("../../../utils/auth/auth", () => ({
  ...jest.requireActual("../../../utils/auth/auth"),
  hashCreate: () => jest.fn().mockReturnValue("#"),
  hashCompare: () => mockHashCompare,
  createToken: () => jest.fn().mockReturnValue("#"),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a registerUser controller function", () => {
  describe("When it's invoked", () => {
    const newUser: UserRegister = {
      name: "Dan",
      surname: "Abramov",
      email: "dan@test.com",
      phoneNumber: "888555222",
      password: "freesabana",
    };

    const status = 201;

    const req: Partial<Request> = { body: newUser };

    test("Then it should call the status method with a 201", async () => {
      User.create = jest.fn().mockResolvedValue(newUser);
      const next: NextFunction = jest.fn();
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await registerUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("And it should call the method json with the responseUser created", async () => {
      const { phoneNumber } = newUser;
      User.create = jest.fn().mockResolvedValue(newUser);

      const next: NextFunction = jest.fn();
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ user: { phoneNumber } }),
      };

      await registerUser(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ user: { phoneNumber } });
    });

    test("Then if it's rejected create method it should call the next function with a custom error", async () => {
      const error = new CustomError(409, "Error creating the user", "");
      User.create = jest.fn().mockRejectedValue(error);

      const next: NextFunction = jest.fn();
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ user: newUser }),
      };

      await registerUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a loginUser function", () => {
  describe("When called with a request, a response and a next function as arguments", () => {
    const mockUser = {
      _id: "123",
      phoneNumber: "name",
      password: "password",
    };

    const mockLoginData = {
      phoneNumber: "name",
      password: "password",
    };
    const req = {
      body: mockLoginData,
    } as Partial<Request>;

    User.find = jest.fn().mockReturnValue([mockUser]);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn() as NextFunction;
    test("It should call status with a code of 200", async () => {
      const status = 200;

      await loginUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("It should respond with a new user as a body", async () => {
      User.find = jest.fn().mockReturnValue([mockUser]);

      await loginUser(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalled();
    });

    test("If find method finds no users it should return an empty array, and an error should be sent to the errors middleware", async () => {
      User.find = jest.fn().mockReturnValue([]);

      await loginUser(req as Request, res as Response, next);
      const error = new CustomError(
        401,
        "Invalid phone number or password",
        "Invalid phone number or password"
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    test("If password is not valid, it should send an error to the errors middleware", async () => {
      User.find = jest.fn().mockReturnValue([mockUser]);

      mockHashCompare = false;

      await loginUser(req as Request, res as Response, next);

      const error = new CustomError(
        404,
        "Invalid password",
        "Invalid phone number or password"
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    test("If something went wrong in express validation, it should send a customError to the errors middleware", async () => {
      const mockBadLoginData = {
        phoneNumber: "phone number",
        password: "",
      };

      User.find = jest.fn().mockRejectedValue(new Error(""));
      const error = new CustomError(
        404,
        "Invalid phone number or password",
        "error"
      );
      const badRequest = { body: mockBadLoginData } as Partial<Request>;

      await loginUser(
        badRequest as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
