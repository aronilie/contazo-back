import User from "./User";

describe("Given a User model", () => {
  describe("When it is called", () => {
    test("Then it should create a model with the properties name, surname, phoneNumber and password", () => {
      const expectedKeys = ["name", "surname", "phoneNumber", "password"];
      const keys = Object.keys(User.schema.paths);
      const userAttributes = [keys[0], keys[1], keys[2], keys[3]];
      expect(userAttributes).toStrictEqual(expectedKeys);
    });
  });
});
