import User from "../models/user.js";

class UserController {
  static #validateUserData(email, password) {
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

  static async loginUser(req, res) {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#successful_responses
    try {
      const { email, password } = req.body;
      const errors = this.#validateUserData(email, password);

      // Si la validación contiene errores, los devuelve como respuesta.
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          message: "User data validation failed",
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

      return res.status(200).json({
        success: true,
        message: "Successful login",
        user: {
          user_id: user.user_id,
          full_name: `${user.first_name} ${user.last_name1} ${user.last_name2}`,
          role: user.role,
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Login process failed",
        error: err.message,
      });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await User.getAll();

      return res.status(200).json({
        success: true,
        users,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Could not fetch users",
        error: err.message,
      });
    }
  }

  static async createUser(req, res) {
    try {
      const user = await User.create(req.body);

      return res.status(200).json({
        success: true,
        message: "User created",
        user_id: user.insertId,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "User creation failed",
        error: err.message,
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updated = await User.update(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "User not found or not updated",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User updated",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "User update failed",
        error: err.message,
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const deleted = await User.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User deleted",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "User deletion failed",
        error: err.message,
      });
    }
  }
}

export default UserController;
