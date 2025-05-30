import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import academicInfoRoutes from "./routes/academicInfoRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import createActivityRoutes from "./routes/createActivityRoutes.js";
import announcements from "./routes/announcementsRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/users", userRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/mensajes", messageRoutes);
app.use("/api/actividades", activityRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/academic_info", academicInfoRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/activities", createActivityRoutes);
app.use("/api/announcements", announcements);

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
