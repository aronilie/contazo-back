import bcrypt from "bcryptjs";
import { JwtPayload } from "../../interfaces/JwTPayload";
import { createToken, hashCompare, hashCreator } from "./auth";

const mockSign = jest.fn().mockReturnValue("Contact");

jest.mock("jsonwebtoken", () => ({
  sign: (payload: JwtPayload) => mockSign(payload),
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
      const mockToken: JwtPayload = {
        id: "1234",
        phoneNumber: "+44 588 24 15 55",
      };

      const returnedValue = createToken(mockToken);

      expect(mockSign).toHaveBeenCalledWith(mockToken);
      expect(returnedValue).toBe("Contact");
    });
  });
});
