
import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
import fs from "node:fs";

dotenv.config();

// ========================================
// SWAGGER CONFIGURATION
// ========================================

const outputFile = "./swagger_output.json";

// Detectar rutas desde server.js
const endpointsFiles = ["./server.js"];

// URL local o pública de Render
const publicUrl =
  process.env.SWAGGER_PUBLIC_URL ||
  process.env.RENDER_EXTERNAL_URL;

const isProduction = Boolean(publicUrl);

const host = isProduction
  ? new URL(publicUrl).host
  : `localhost:${process.env.PORT || 3000}`;

// ========================================
// API DOCUMENTATION
// ========================================

const doc = {
  info: {
    version: "2.0.0",
    title: "TechNova Management API",
    description:
      "REST API for managing workers, departments, " +
      "projects, tasks and clients using Node.js, " +
      "Express, MongoDB Atlas and JWT authentication.",
  },

  host,
  basePath: "/",

  schemes: isProduction ? ["https"] : ["http"],

  consumes: ["application/json"],
  produces: ["application/json"],

  // ========================================
  // API CATEGORIES
  // ========================================

  tags: [
    {
      name: "Workers",
      description: "Worker Management - JWT Required",
    },
    {
      name: "Departments",
      description: "Department Management - JWT Required",
    },
    {
      name: "Projects",
      description: "Project Management - JWT Required",
    },
    {
      name: "Tasks",
      description: "Task Management - JWT Required",
    },
    {
      name: "Clients",
      description: "Client Management - JWT Required",
    },
  ],

  // ========================================
  // JWT AUTHENTICATION
  // ========================================

  securityDefinitions: {
    ApiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "Enter your JWT using this format: " +
        "Bearer YOUR_JWT_TOKEN",
    },
  },

  // ========================================
  // DATABASE MODELS
  // ========================================

  definitions: {
    Worker: {
      id: 1,
      name: "John Smith",
      age: "30",
      position: "Developer",
      department: "IT",
      salary: "3500",
      active: true,
    },

    Department: {
      id: 1,
      name: "Information Technology",
      description: "Technology Department",
      location: "Lima",
      manager: "John Smith",
      budget: 50000,
      active: true,
    },

    Project: {
      id: 1,
      name: "Company Website",
      description: "Develop a company website",
      status: "In Progress",
      manager: "John Smith",
      startDate: "2026-10-10",
      endDate: "2026-12-20",
      budget: 15000,
      active: true,
    },

    Task: {
      id: 1,
      title: "Design Database",
      description: "Create MongoDB models",
      projectId: 1,
      assignedTo: "Jane Smith",
      priority: "High",
      status: "Pending",
      dueDate: "2026-11-15",
      completed: false,
    },

    Client: {
      id: 1,
      name: "Carlos Rodriguez",
      email: "carlos@example.com",
      phone: "987654321",
      company: "Tech Solutions",
      address: "Av. Principal 123",
      city: "Lima",
      country: "Peru",
      active: true,
    },
  },
};

// ========================================
// AUTOMATIC ROUTE ORGANIZATION
// ========================================

const categories = {
  "/workers": "Workers",
  "/departments": "Departments",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/clients": "Clients",
};

const httpMethods = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
];

// ========================================
// GENERATE SWAGGER DOCUMENTATION
// ========================================

const generateSwagger = async () => {
  try {
    const result = await swaggerAutogen({
      language: "en-US",
    })(outputFile, endpointsFiles, doc);

    if (result === false) {
      throw new Error("Swagger generation failed");
    }

    const swagger = JSON.parse(
      fs.readFileSync(outputFile, "utf8")
    );

    // Ensure JWT security is defined
    swagger.securityDefinitions = {
      ...swagger.securityDefinitions,

      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description:
          "Enter: Bearer YOUR_JWT_TOKEN",
      },
    };

    let protectedOperations = 0;

    // ========================================
    // TAGS AND JWT SECURITY BY ROUTE
    // ========================================

    for (const [path, operations] of Object.entries(
      swagger.paths || {}
    )) {
      const matchedCategory = Object.entries(
        categories
      ).find(([prefix]) => {
        return (
          path === prefix ||
          path.startsWith(prefix + "/")
        );
      });

      // Keep /health and other public paths unprotected
      if (!matchedCategory) {
        continue;
      }

      const [, category] = matchedCategory;

      for (const method of httpMethods) {
        const operation = operations[method];

        if (!operation) {
          continue;
        }

        // Assign correct category
        operation.tags = [category];

        // Require JWT in Swagger
        operation.security = [
          {
            ApiKeyAuth: [],
          },
        ];

        // Document unauthorized responses
        operation.responses = {
          ...operation.responses,

          "401": {
            description:
              "Unauthorized - JWT token missing, " +
              "invalid or expired.",
          },
        };

        protectedOperations++;
      }
    }

    if (protectedOperations === 0) {
      throw new Error(
        "No protected endpoints were detected. " +
        "Check route discovery in server.js."
      );
    }

    // ========================================
    // SAVE SWAGGER JSON
    // ========================================

    fs.writeFileSync(
      outputFile,
      JSON.stringify(swagger, null, 2),
      "utf8"
    );

    console.log("================================");
    console.log(" TECHNOVA MANAGEMENT API");
    console.log("================================");
    console.log("Swagger generated successfully!");
    console.log(`Host: ${host}`);
    console.log("JWT Authentication: ENABLED");
    console.log(
      `Protected operations: ${protectedOperations}`
    );
    console.log("--------------------------------");
    console.log("Workers");
    console.log("Departments");
    console.log("Projects");
    console.log("Tasks");
    console.log("Clients");
    console.log("================================");

  } catch (error) {
    console.error(
      "Swagger generation error:",
      error.message
    );

    process.exitCode = 1;
  }
};

generateSwagger();
