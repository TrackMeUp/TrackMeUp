class UserController {
    validateUserData(user, password) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const errors = {};

        if (!user) {
            errors.user = "User required";
        } else if (!emailRegex.test(user)) {
            errors.user = "User format";
        }

        if (!password) {
            errors.password = "Password required";
        } else if (password.length < 6) {
            errors.password = "Password format";
        }

        return errors;
    }

    loginUser(req, res) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#successful_responses
        try {
            const { user, password } = req.body;
            const errors = this.validateUserData(user, password);

            // Si la validación contiene errores, los devuelve como respuesta.
            if (Object.keys(errors).lenght > 0) {
                return res.status(400).json({
                    success: false,
                    message: "User data validation failed.",
                    errors,
                });
            }

            // TODO: Lógica de login e integración con la base de datos.

            res.status(200).json({
                success: true,
                message: "Successful login",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
}

module.exports = new UserController();
