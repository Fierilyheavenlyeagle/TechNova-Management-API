import swaggerAutogen from "swagger-autogen";
const outputFile = "./swagger_output.json";

const endpointsFiles = ["./routes/workers.js"];

const doc = {
  info: {
    title: "Company Project API",
    description: "API for managing humans resources and distributors",
  },
  host: "localhost:3000",
  schemes: ["http"],
  securityDefinitions: {
    ApiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Enter: Bearer <your_token>",
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("swagger.json generated");
});
