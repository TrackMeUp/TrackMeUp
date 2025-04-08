import { describe, it, expect, beforeEach, vi } from "vitest";
import UserController from "./userController.js";
import User from "../models/user.js";

vi.mock("../models/user.js", () => ({
  default: {
    getByEmail: vi.fn(),
  },
}));

describe("UserController", () => {
  let request, response;

  beforeEach(() => {
    vi.clearAllMocks();

    request = { body: {} };
    response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  describe("loginUser", () => {
    describe("Input validation", () => {
      it("should return 400 when email is missing", async () => {
        request.body = { email: null, password: "password" };

        await UserController.loginUser(request, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
          success: false,
          message: "User data validation failed",
          errors: { email: "Email required" },
        });
      });

      it("should return 400 when email format is invalid", async () => {
        request.body = { email: "test", password: "password" };

        await UserController.loginUser(request, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
          success: false,
          message: "User data validation failed",
          errors: { email: "Email format" },
        });
      });

      it("should return 400 when password is missing", async () => {
        request.body = { email: "test@test.com", password: null };

        await UserController.loginUser(request, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
          success: false,
          message: "User data validation failed",
          errors: { password: "Password required" },
        });
      });

      it("should return 400 when password format is invalid", async () => {
        request.body = { email: "test@test.com", password: "word" };

        await UserController.loginUser(request, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
          success: false,
          message: "User data validation failed",
          errors: { password: "Password format" },
        });
      });
    });

    it("should return 401 when user is not found", async () => {
      request.body = { email: "test@test.com", password: "password" };
      User.getByEmail.mockResolvedValue(null);

      await UserController.loginUser(request, response);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid username or password",
      });
    });

    it("should return 401 when password does not match", async () => {
      request.body = { email: "test@test.com", password: "password" };
      User.getByEmail.mockResolvedValue({
        email: "test@test.com",
        password: "123456789",
      });

      await UserController.loginUser(request, response);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid username or password",
      });
    });

    it("should return 200 on successful login", async () => {
      const userMock = {
        id: 999,
        email: "test@test.com",
        password: "password",
      };

      request.body = { email: userMock.email, password: userMock.password };
      User.getByEmail.mockResolvedValue(userMock);

      await UserController.loginUser(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        success: true,
        message: "Successful login",
        user: userMock,
      });
    });

    it("should return 500 on server error", async () => {
      request.body = { email: "test@test.com", password: "password" };
      const error = new Error("Database connection failed");
      User.getByEmail.mockRejectedValue(error);

      await UserController.loginUser(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        message: "Login process failed",
        error: error.message,
      });
    });
  });
});
