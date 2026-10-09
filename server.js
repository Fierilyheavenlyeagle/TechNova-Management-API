
import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import cors from "cors";

// ========================================
// JWT AUTHENTICATION
// ========================================

import { auth } from "./middleware/auth.js";

// ========================================
// DATABASE
// ========================================

import connectDB from "./config/db.js";

// ========================================
// ROUTES
// ========================================

import workersRoutes from "./routes/workers.js";
import departmentRoutes from "./routes/departments.js";
import projectsRoutes from "./routes/projects.js";
import tasksRoutes from "./routes/tasks.js";
import clientsRoutes from "./routes/clients.js";

// ========================================
// EXPRESS CONFIGURATION
// ========================================

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// SWAGGER DOCUMENTATION
// ========================================

const swaggerFile = JSON.parse(
  fs.readFileSync("./swagger_output.json", "utf8")
);

const swaggerOptions = {
  explorer: true,

  swaggerOptions: {
    // Mostrar categorías inicialmente cerradas
    docExpansion: "none",

    // Mostrar Models al final de Swagger
    defaultModelsExpandDepth: 1,

    // Mostrar atributos de los modelos
    defaultModelExpandDepth: 1,

    // Activar buscador de endpoints
    filter: true,

    // Mostrar duración de solicitudes
    displayRequestDuration: true,

    // Mantener el orden definido en swagger.js
    tagsSorter: undefined,

    // Métodos HTTP disponibles
    supportedSubmitMethods: [
      "get",
      "post",
      "put",
      "delete",
      "patch"
    ],

    // Conservar autorización durante la sesión
    persistAuthorization: true,
  },

  customSiteTitle: "TechNova Management API | Documentation",
};

// Swagger visible sin JWT.
// Las solicitudes a los endpoints sí requieren JWT.
app.use(
  "/api",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, swaggerOptions)
);

// ========================================
// HEALTH CHECK
// ========================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "online",
    company: "TechNova Solutions",
    api: "TechNova Management API",
    version: "1.0.0",
  });
});

// ========================================
// PROTECTED API ROUTES - JWT
// ========================================

// Todas estas rutas requieren un JWT válido.

// Workers
app.use("/workers", auth, workersRoutes);

// Departments
app.use("/departments", auth, departmentRoutes);

// Projects
app.use("/projects", auth, projectsRoutes);

// Tasks
app.use("/tasks", auth, tasksRoutes);

// Clients
app.use("/clients", auth, clientsRoutes);

// ========================================
// 404 - ENDPOINT NOT FOUND
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "The requested endpoint does not exist",
    path: req.originalUrl,
  });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  const statusCode =
    err.statusCode || err.status || 500;

  const message =
    err.description ||
    err.message ||
    "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: err.name || "Error",
    message,
  });
});

// ========================================
// DATABASE CONNECTION & SERVER START
// ========================================

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");

    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log("================================");
      console.log("     TECHNOVA MANAGEMENT API");
      console.log("================================");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Swagger: http://localhost:${PORT}/api`);
      console.log(`Health: http://localhost:${PORT}/health`);
      console.log("--------------------------------");
      console.log("Protected API Categories:");
      console.log("1. Workers");
      console.log("2. Departments");
      console.log("3. Projects");
      console.log("4. Tasks");
      console.log("5. Clients");
      console.log("--------------------------------");
      console.log("JWT Authentication: ENABLED");
      console.log("================================");
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
