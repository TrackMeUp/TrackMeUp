const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 3000;

// TEST: origin
//app.use(cors({ origin: "http://localhost:5173" }));
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/users", userRoutes);

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
