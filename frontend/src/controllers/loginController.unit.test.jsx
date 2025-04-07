import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateLogin } from "./loginController.jsx";

describe("validateLogin", () => {
  let alertMock;

  beforeEach(() => {
    vi.clearAllMocks();

    alertMock = vi.fn();
    global.alert = alertMock;
  });

  it("should return false when email is missing", () => {
    const result = validateLogin(null, "password");

    expect(result).toBe(false);
    expect(alertMock).toHaveBeenCalledWith(
      "Debe rellenar todos los campos para iniciar sesión.",
    );
  });

  it("should return false when email format is invalid", () => {
    const result = validateLogin("test", "password");

    expect(result).toBe(false);
    expect(alertMock).toHaveBeenCalledWith(
      "El usuario debe ser un correo electrónico.",
    );
  });

  it("should return false when password is missing", () => {
    const result = validateLogin("test@test.com", null);

    expect(result).toBe(false);
    expect(alertMock).toHaveBeenCalledWith(
      "Debe rellenar todos los campos para iniciar sesión.",
    );
  });

  it("should return false when email format is invalid", () => {
    const result = validateLogin("test@test.com", "word");

    expect(result).toBe(false);
    expect(alertMock).toHaveBeenCalledWith(
      "La contraseña debe tener al menos 6 caracteres.",
    );
  });

  it("should return true on succesful login data validation", () => {
    const result = validateLogin("test@test.com", "password");

    expect(result).toBe(true);
  });
});
