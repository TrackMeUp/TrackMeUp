const express = require("express");

const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();
const PORT = 3000;

// Conexión con la base de datos
const pool = require("./db/connection");
// Permite conectar con la base de datos utilizando `req.app.locals.pool`.
// Ver: https://expressjs.com/en/4x/api.html#app.locals
app.locals.pool = pool;

app.use(express.json());

// Rutas API
app.use("/api/users", userRoutes);
app.use("/api/health", healthRoutes);

// Maneja cualquier error no controlado de forma explícita.
// Debe ser el último middleware (`app.use`).
// Ver: https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
