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
  getContactByPhoneNumber,
  getContacts,
  updateContact,
} from "./contactsController";

const mockUser = {
  name: "Dan",
  surname: "Abramov",
  email: "dan@test.com",
  phoneNumber: "888555222",
  owner: "63175d13ef184c29a92d2e67",
};

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
  afterEach(() => jest.clearAllMocks());

  const mockPayloadUser: JwtCustomPayload = {
    id: "631a343b95e83e49b95f9646",
    phoneNumber: "888555222",
  };

  const req = {
    payload: mockPayloadUser,
    params: { id: "888555222" },
  } as Partial<Request>;

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next: Partial<NextFunction> = jest.fn();

  describe("When it receives a valid id", () => {
    test("Then it should call status function with status code 201", async () => {
      const expectedStatus = 201;
      ContactModel.findOneAndDelete = jest.fn();

      await deleteContact(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the json method with a next", async () => {
      const text = "Contact successfully deleted";
      ContactModel.findOneAndDelete = jest.fn();

      await deleteContact(
        req as CustomRequest,
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

      ContactModel.findOneAndDelete = jest.fn().mockRejectedValue(customError);

      await deleteContact(
        req as CustomRequest,
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

  describe("When it receives a request and a contact", () => {
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

describe("Given a getContactByPhoneNumber function", () => {
  afterEach(() => jest.clearAllMocks());

  describe("When it is called with a valid id", () => {
    const mockPayloadUser: JwtCustomPayload = {
      id: "631a343b95e83e49b95f9646",
      phoneNumber: "888555222",
    };

    const req = {
      payload: mockPayloadUser,
      params: { id: "888555222" },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn() as NextFunction;

    test("Then it should call status function with status code 200", async () => {
      const expectedStatus = 200;
      ContactModel.findOne = jest.fn().mockReturnThis();

      await getContactByPhoneNumber(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the next error with a custom error", async () => {
      const customError = new CustomError(
        400,
        "Error loading contact",
        "Error loading contact"
      );

      ContactModel.findOne = jest.fn().mockRejectedValue(customError);

      await getContactByPhoneNumber(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

describe("Given a updateContact function", () => {
  afterEach(() => jest.clearAllMocks());

  const newContact = {
    name: "Dan",
    surname: "Abramov",
    email: "dan@test.com",
    phoneNumber: "888555222",
  };

  const mockPayloadUser: JwtCustomPayload = {
    id: "631a343b95e83e49b95f9646",
    phoneNumber: "888555222",
  };

  const req = {
    payload: mockPayloadUser,
    params: { id: "888555222" },
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const next: Partial<NextFunction> = jest.fn();

  describe("When it receives a request and a new contact to update", () => {
    test("Then it should call the status function with code 201", async () => {
      const expectedStatus = 201;

      ContactModel.findOneAndUpdate = jest.fn().mockResolvedValue(newContact);
      await updateContact(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the response method with the next message 'Contact successfully updated'", async () => {
      ContactModel.findOneAndUpdate = jest.fn().mockResolvedValue(newContact);
      const expectedText = "Contact successfully updated";

      await updateContact(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedText);
    });
  });

  describe("When it receives a request and a wrong contact", () => {
    test("Then it should call the next function and show the message 'Error updating contact'", async () => {
      const finalError = new CustomError(
        400,
        "Error updating contact",
        "Error updating contact"
      );

      ContactModel.findOneAndUpdate = jest.fn().mockRejectedValue(finalError);
      await updateContact(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(finalError);
    });
  });
});
