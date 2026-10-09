import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import cors from "cors";

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
  fs.readFileSync("./swagger_output.json", "utf8"),
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

    // Mantener el orden de categorías definido en swagger.js
    tagsSorter: undefined,

    // Métodos HTTP disponibles
    supportedSubmitMethods: ["get", "post", "put", "delete", "patch"],

    // Conservar autorización en la sesión
    persistAuthorization: true,
  },

  customSiteTitle: "Project-W03 | API Documentation",
};

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerFile, swaggerOptions));

// ========================================
// API ROUTES
// ========================================

// Workers
app.use("/workers", workersRoutes);

// Departments
app.use("/departments", departmentRoutes);

// Projects
app.use("/projects", projectsRoutes);

// Tasks
app.use("/tasks", tasksRoutes);

// Clients
app.use("/clients", clientsRoutes);

// ========================================
// ERROR HANDLING
// ========================================
// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "online",
    company: "TechNova Solutions",
    api: "TechNova Management API",
    version: "1.0.0"
  });
});

// 404 - Endpoint not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "The requested endpoint does not exist",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  const message = err.description || err.message || "Internal Server Error";

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
      console.log("     PROJECT-W03 BACKEND");
      console.log("================================");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Swagger: http://localhost:${PORT}/api`);
      console.log("--------------------------------");
      console.log("Available API Categories:");
      console.log("1. Workers");
      console.log("2. Departments");
      console.log("3. Projects");
      console.log("4. Tasks");
      console.log("5. Clients");
      console.log("================================");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
