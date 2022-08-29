import CustomError from "./CustomError";

describe("Given a CustomError class", () => {
  const errorCode = 401;
  const publicMessage = "Invalid username or password";
  const privateMessage = "Invalid password";

  describe("When it is instantiated with the message 'Invalid username or password'", () => {
    test("Then it should return an error object with that message", () => {
      const expectedError = new Error(publicMessage);

      const resultError = new CustomError(
        errorCode,
        publicMessage,
        privateMessage
      );

      expect(resultError).toEqual(expectedError);
    });
    test("Then it should return an error object which also contains the remaining data", () => {
      const resultError = new CustomError(
        errorCode,
        publicMessage,
        privateMessage
      );

      expect(resultError.statusCode).toBe(errorCode);
      expect(resultError.publicMessage).toBe(publicMessage);
      expect(resultError.privateMessage).toBe(privateMessage);
    });
  });
});
