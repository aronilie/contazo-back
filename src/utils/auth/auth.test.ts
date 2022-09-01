import { hashCreator } from "./auth";

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
