
import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
import fs from "node:fs";

dotenv.config();

// ========================================
// SWAGGER CONFIGURATION
// ========================================

const outputFile = "./swagger_output.json";

// Detectar rutas desde el servidor principal
const endpointsFiles = ["./server.js"];

const isProduction = Boolean(process.env.RENDER_EXTERNAL_URL);

const host = isProduction
  ? new URL(process.env.RENDER_EXTERNAL_URL).host
  : `localhost:${process.env.PORT || 3000}`;

// ========================================
// API DOCUMENTATION
// ========================================

const doc = {
  info: {
    version: "2.0.0",
    title: "Company Management API",
    description:
      "REST API for managing workers, departments, projects, tasks and clients using Node.js, Express and MongoDB Atlas.",
  },

  host,
  basePath: "/",

  schemes: isProduction ? ["https"] : ["http"],

  consumes: ["application/json"],
  produces: ["application/json"],

  // ========================================
  // CATEGORIES
  // ========================================

  tags: [
    {
      name: "Workers",
      description: "Worker Management",
    },
    {
      name: "Departments",
      description: "Department Management",
    },
    {
      name: "Projects",
      description: "Project Management",
    },
    {
      name: "Tasks",
      description: "Task Management",
    },
    {
      name: "Clients",
      description: "Client Management",
    },
  ],

  // ========================================
  // AUTHENTICATION DOCUMENTATION
  // ========================================

  securityDefinitions: {
    ApiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Enter: Bearer <your_token>",
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

// Generar Swagger
swaggerAutogen({ language: "en-US" })(
  outputFile,
  endpointsFiles,
  doc
)
  .then(() => {
    const swagger = JSON.parse(
      fs.readFileSync(outputFile, "utf8")
    );

    // Asignar cada ruta a su categoría
    for (const [path, operations] of Object.entries(
      swagger.paths || {}
    )) {
      for (const [prefix, category] of Object.entries(
        categories
      )) {
        if (
          path === prefix ||
          path.startsWith(prefix + "/")
        ) {
          for (const method of httpMethods) {
            if (operations[method]) {
              operations[method].tags = [category];
            }
          }

          break;
        }
      }
    }

    // Guardar Swagger organizado
    fs.writeFileSync(
      outputFile,
      JSON.stringify(swagger, null, 2),
      "utf8"
    );

    console.log("--------------------------------");
    console.log("Swagger generated successfully!");
    console.log("--------------------------------");
    console.log("Workers");
    console.log("Departments");
    console.log("Projects");
    console.log("Tasks");
    console.log("Clients");
    console.log("--------------------------------");
  })
  .catch((error) => {
    console.error("Swagger generation error:", error);
    process.exitCode = 1;
  });
