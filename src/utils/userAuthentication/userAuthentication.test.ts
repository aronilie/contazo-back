import { NextFunction, Response } from "express";
import { CustomRequest } from "../../interfaces/JwTPayload";
import CustomError from "../CustomError/CustomError";
import userAuthentication from "./userAuthentication";

const mockVerifyToken = jest.fn();

jest.mock("../../utils/auth/auth", () => ({
  ...jest.requireActual("../../utils/auth/auth"),
  verifyToken: (token: string) => mockVerifyToken(token),
}));

describe("Given an userAuthentificationvmiddleware", () => {
  describe("When it receives a request object", () => {
    describe("And there is a correct authentification with 'Bearer #'", () => {
      test("Then it should call the next function with userToken as request payload", () => {
        const error = {};
        const req = {
          get: jest.fn().mockReturnValue("Bearer #"),
        } as Partial<CustomRequest>;

        const res = {} as Partial<Response>;

        const next = jest.fn() as NextFunction;

        userAuthentication(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalledWith(error);
        expect(req).toHaveProperty("payload");
      });
    });

    describe("And when is no 'Authorization' in the header", () => {
      test("Then it should call the next function with an error", () => {
        const req = {
          get: jest.fn().mockReturnValue(""),
        } as Partial<CustomRequest>;

        const res = {} as Partial<Response>;

        const next = jest.fn() as NextFunction;
        const mockError = new CustomError(
          400,
          "Bad request",
          "Error of authentication"
        );

        userAuthentication(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(mockError);
      });
    });

    describe("And when the Authorization header at request doesn't start with 'Bearer '", () => {
      test("Then it should call the next function with an error", () => {
        const req = {
          get: jest.fn().mockReturnValue("Fake "),
        } as Partial<CustomRequest>;

        const res = {} as Partial<Response>;

        const next = jest.fn() as NextFunction;

        const error = new CustomError(
          400,
          "Bad request",
          "Error of authentication"
        );

        userAuthentication(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });

    describe("And when the verifyToken function return a string", () => {
      test("Then it should call the next function with an error and a request without payload", () => {
        mockVerifyToken.mockReturnValue("");

        const req = {
          get: jest.fn().mockReturnValue("Bearer #"),
        } as Partial<CustomRequest>;

        const res = {} as Partial<Response>;

        const next = jest.fn() as NextFunction;

        const error = new CustomError(
          400,
          "Bad request",
          "Error of authentication"
        );

        userAuthentication(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
        expect(req).not.toHaveProperty("payload");
      });
    });
  });
});
