import { NextFunction, Request, Response } from "express";
import CustomError from "../CustomError/CustomError";
import { generalError, notFoundError } from "./errors";

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
const nextFunction: NextFunction = jest.fn();

beforeEach(() => {
  mockRequest = {};
  mockResponse = {
    json: jest.fn(),
  };
});

describe("Given notFoundError function", () => {
  describe("When it is instantiated with the error message 'Oops! Page not found :('", () => {
    test("Then it should give a response with the error message", async () => {
      const expectedResponse = {
        error: "Oops! Page not found :(",
      };

      notFoundError(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });
  });
});

describe("Given generalError function", () => {
  describe("When it is instantiated with an error message 'Something went wrong :('", () => {
    test("Then it should give a response with the error message", async () => {
      const error: CustomError = {
        publicMessage: "Something went wrong :(",
        code: "",
        message: "",
        name: "",
        privateMessage: "",
        statusCode: 500,
      };

      const expectedResponse = { error: error.publicMessage };

      generalError(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });
  });

  describe("When it is instantiated with a statusCode null", () => {
    test("Then it should give a response with the statusCode 500", async () => {
      const error: CustomError = {
        publicMessage: "",
        code: "",
        message: "",
        name: "",
        privateMessage: "",
        statusCode: null,
      };

      const expectedResponse = 500;

      generalError(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.statusCode).toBe(expectedResponse);
    });
  });
});
