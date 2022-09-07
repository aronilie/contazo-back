import { ContactModel } from "./Contact";

describe("Given a Contact model", () => {
  describe("When it is called", () => {
    test("Then it should create a model with the properties name, surname, email, phoneNumber, image and owner", () => {
      const expectedKeys = [
        "name",
        "surname",
        "email",
        "phoneNumber",
        "image",
        "owner",
      ];
      const keys = Object.keys(ContactModel.schema.paths);
      const userAttributes = [
        keys[0],
        keys[1],
        keys[2],
        keys[3],
        keys[4],
        keys[5],
      ];
      expect(userAttributes).toStrictEqual(expectedKeys);
    });
  });
});
