import { NextFunction, Request, Response } from "express";
import { ContactModel } from "../../../database/models/Contact/Contact";
import {
  CustomRequest,
  JwtCustomPayload,
} from "../../../interfaces/JwTPayload";
import getContacts from "./contactsController";

describe("Given a getContacts function", () => {
  afterEach(() => jest.clearAllMocks());

  describe("When it is called with a request, response and next function", () => {
    const mockPayloadUser: JwtCustomPayload = {
      id: "63175d13ef184c29a92d2e67",
      phoneNumber: "888555222",
    };

    const req = {
      payload: mockPayloadUser,
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn() as NextFunction;

    describe("And the user is on database", () => {
      const mockUser = {
        name: "Dan",
        surname: "Abramov",
        email: "dan@test.com",
        phoneNumber: "888555222",
        owner: "63175d13ef184c29a92d2e67",
      };

      test("Then it should call the status method with a 200", async () => {
        const expectedStatus = 200;

        ContactModel.find = jest.fn().mockReturnThis();
        ContactModel.populate = jest.fn().mockReturnValue(mockUser);

        await getContacts(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });

      test("Then it should invoke the response method json with the owner contacts ", async () => {
        const expectedContacts = {
          contacts: {
            name: "Dan",
            surname: "Abramov",
            email: "dan@test.com",
            phoneNumber: "888555222",
            owner: "63175d13ef184c29a92d2e67",
          },
        };

        ContactModel.find = jest.fn().mockReturnThis();
        ContactModel.populate = jest.fn().mockReturnValue(mockUser);

        await getContacts(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenLastCalledWith(expectedContacts);
      });
    });

    describe("And the user isn't on the data base", () => {
      test("Then it should invoke next method", async () => {
        const mockUserNotFound: null = null;
        const mockUserWithoutContacts = {
          name: "Dan",
          surname: "Abramov",
          email: "dan@test.com",
          phoneNumber: "888555222",
          password:
            "$2a$10$daP7dm2Ec4RoPvkmfIwLuOYOp1.tjAM99OQvYFkShXKRqF/7ogg9W",
          contacts: [{}],
        };

        ContactModel.find = jest.fn().mockResolvedValue(mockUserNotFound);
        ContactModel.populate = jest
          .fn()
          .mockReturnValue(mockUserWithoutContacts);

        await getContacts(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalled();
      });
    });
  });
});
