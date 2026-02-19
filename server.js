import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import departmentRoutes from "./routes/departments.js";

import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import cors from "cors";

import workersRoutes from "./routes/workers.js";
import connectDB from "./config/db.js";

import passport from "passport";
import "./config/passport.js";

import authRoutes from "./routes/auth.js";

connectDB();

const swaggerFile = JSON.parse(
  fs.readFileSync("./swagger_output.json", "utf8"),
);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/auth", authRoutes);
app.use("/workers", workersRoutes);
app.use("/departments", departmentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.description || err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: err.name || "Error",
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api`);
});
