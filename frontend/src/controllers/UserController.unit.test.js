import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserController } from "./UserController";
import { loginUser } from "../services/api/UserApiService";
import { validateLogin } from "./loginController";

vi.mock("../services/api/UserApiService", () => ({
  loginUser: vi.fn(),
}));

vi.mock("./loginController", () => ({
  validateLogin: vi.fn(),
}));

describe("login", () => {
  const email = "test@test.com";
  const password = "password";
  let controller;

  beforeEach(() => {
    controller = new UserController();
    vi.clearAllMocks();
  });

  it("should return false if validateLogin fails", async () => {
    validateLogin.mockReturnValue(false);

    const result = await controller.login(email, password);

    expect(result).toEqual({ success: false });
    expect(validateLogin).toHaveBeenCalledWith(email, password);
  });

  it("should return false with server error if loginUser fails", async () => {
    validateLogin.mockReturnValue(true);
    loginUser.mockResolvedValue({
      success: false,
      error: "Invalid credentials",
    });

    const result = await controller.login(email, password);

    expect(result).toEqual({
      success: false,
      errors: { server: "Invalid credentials" },
    });
  });

  it("should return success with user data if loginUser succeeds", async () => {
    const mockUser = { id: 1, name: "Test" };

    validateLogin.mockReturnValue(true);
    loginUser.mockResolvedValue({
      success: true,
      data: { user: mockUser },
    });

    const result = await controller.login(email, password);

    expect(result).toEqual({
      success: true,
      user: mockUser,
    });
  });
});
