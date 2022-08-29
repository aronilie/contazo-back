import { Request, Response } from "express";
import { notFoundError } from "./errors";

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;

beforeEach(() => {
  mockRequest = {};
  mockResponse = {
    json: jest.fn(),
  };
});

describe("Given notFoundError function", () => {
  describe("When it is instantiated", () => {
    test("Then it should give a response with the error message 'Oops! Page not found :('", async () => {
      const expectedResponse = {
        error: "Oops! Page not found :(",
      };
      notFoundError(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });
  });
});
