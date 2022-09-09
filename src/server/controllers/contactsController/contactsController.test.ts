import { NextFunction, Request, Response } from "express";
import { ContactModel } from "../../../database/models/Contact/Contact";
import {
  CustomRequest,
  JwtCustomPayload,
} from "../../../interfaces/JwTPayload";
import CustomError from "../../../utils/CustomError/CustomError";
import {
  createContact,
  deleteContact,
  getContacts,
} from "./contactsController";

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

describe("Given a deleteContact function", () => {
  const req: Partial<Request> = { params: { id: "4444" } };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: Partial<NextFunction> = jest.fn();

  describe("When it receives a valid id", () => {
    test("Then it should call status function with status code 201", async () => {
      const expectedStatus = 201;
      ContactModel.findByIdAndDelete = jest.fn();

      await deleteContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the json method with a next", async () => {
      const text = "Contact successfully deleted";
      ContactModel.findByIdAndDelete = jest.fn();

      await deleteContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(text);
    });

    test("Then it should call the next error with a custom error", async () => {
      const customError = new CustomError(
        400,
        "Error deleting contact",
        "Error deleting contact"
      );

      ContactModel.findByIdAndDelete = jest.fn().mockRejectedValue(customError);

      await deleteContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

describe("Given a createContact function", () => {
  const contact = {
    name: "Dan",
    surname: "Abramov",
    email: "dan@test.com",
    phoneNumber: "888555222",
  };

  const req: Partial<Request> = {};
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: Partial<NextFunction> = jest.fn();

  describe("When it receives a response and a contact", () => {
    test("Then it should call status function with code 201", async () => {
      const expectedStatus = 201;

      ContactModel.create = jest.fn().mockResolvedValue(contact);
      await createContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the response method with the text 'Contact successfully created'", async () => {
      ContactModel.create = jest.fn().mockResolvedValue(contact);
      const expectedText = "Contact successfully created";

      await createContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedText);
    });
  });

  describe("When it receives a response and a wrong contact", () => {
    test("Then it should call next function and show the message 'Error creating contact'", async () => {
      const finalError = new CustomError(
        400,
        "Error creating contact",
        "Error creating contact"
      );

      ContactModel.create = jest.fn().mockRejectedValue(finalError);
      await createContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(finalError);
    });
  });
});
