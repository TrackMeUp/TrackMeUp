import User from "../models/user.js";

class UserController {
  validateUserData(email, password) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const errors = {};

    if (!email) {
      errors.email = "Email required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Email format";
    }

    if (!password) {
      errors.password = "Password required";
    } else if (password.length < 6) {
      errors.password = "Password format";
    }

    return errors;
  }

  async loginUser(req, res) {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#successful_responses
    try {
      const { email, password } = req.body;
      const errors = this.validateUserData(email, password);

      // Si la validación contiene errores, los devuelve como respuesta.
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          message: "User data validation failed.",
          errors,
        });
      }

      const user = await User.getByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      res.status(200).json({
        success: true,
        message: "Successful login",
        user: user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }
}

export default new UserController();
