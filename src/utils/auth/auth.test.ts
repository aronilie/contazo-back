import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JwtCustomPayload } from "../../interfaces/JwTPayload";
import { createToken, hashCompare, hashCreator, verifyToken } from "./auth";

const mockSign = jest.fn().mockReturnValue("Contact");

jest.mock("jsonwebtoken", () => ({
  sign: (payload: JwtCustomPayload) => mockSign(payload),
}));

describe("Given a hashCreator function", () => {
  describe("When it is called with a string as an argument", () => {
    const hashCreatorMock = jest.fn(hashCreator);
    const password = "admin";
    const hashStart = "$2a$10$";

    test("Then it should return a promise with a string that is a hash of the argument provided", async () => {
      const result = await hashCreatorMock(password);

      expect(result.startsWith(hashStart)).toBe(true);
    });

    test("Then it should create a hash with a length larger than 10", async () => {
      const result = await hashCreatorMock(password);

      expect(result.length > 10).toBe(true);
    });
  });
});

describe("Given a hashCompare function", () => {
  describe("When it is called with a text and a hash as arguments", () => {
    const firstHash = "Contact";
    const secondHash = "Contact";

    bcrypt.compare = jest.fn().mockReturnValue("Contact");

    const returnedValue = hashCompare(firstHash, secondHash);

    expect(bcrypt.compare).toHaveBeenCalledWith(firstHash, secondHash);
    expect(returnedValue).toBe("Contact");
  });
});

describe("Given a createToken function", () => {
  describe("When called with a payload as an argument", () => {
    test("Then it should call jwt and return its returned value", () => {
      const mockToken: JwtCustomPayload = {
        id: "1234",
        phoneNumber: "+44 588 24 15 55",
      };

      const returnedValue = createToken(mockToken);

      expect(mockSign).toHaveBeenCalledWith(mockToken);
      expect(returnedValue).toBe("Contact");
    });
  });
});

describe("Given a verifyToken function", () => {
  describe("When it is called with a token and a secret", () => {
    test("Then it should return 'false'", () => {
      const expectedString = "error";
      const mockedToken = "#";
      jwt.verify = jest.fn().mockReturnValue(expectedString);

      const resultToken = verifyToken(mockedToken);

      expect(resultToken).toBe(expectedString);
    });

    test("Then it should return an object with id and phoneNumber", () => {
      const expectedPayload: JwtCustomPayload = {
        id: "0",
        phoneNumber: "888555222",
      };
      const mockedToken = "#";
      jwt.verify = jest.fn().mockReturnValue(expectedPayload);

      const resultToken = verifyToken(mockedToken);

      expect(resultToken).toStrictEqual(expectedPayload);
    });
  });
});
