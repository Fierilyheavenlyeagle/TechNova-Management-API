
import express from "express";
import ProjectController from "../controllers/projectController.js";

const router = express.Router();

// GET - Obtener todos los proyectos
router.get("/", (req, res, next) => {
  // #swagger.tags = ['Projects']
  // #swagger.summary = 'Get all projects'
  return ProjectController.findAll(req, res, next);
});

// GET - Obtener proyecto por ID
router.get("/:id", (req, res, next) => {
  // #swagger.tags = ['Projects']
  // #swagger.summary = 'Get project by ID'
  return ProjectController.findOne(req, res, next);
});

// POST - Crear un proyecto
router.post("/", (req, res, next) => {
  // #swagger.tags = ['Projects']
  // #swagger.summary = 'Create a project'
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      name: 'Company Website',
      description: 'Develop a company website',
      status: 'Pending',
      manager: 'John Smith',
      budget: 15000,
      active: true
    }
  } */
  return ProjectController.create(req, res, next);
});

// PUT - Actualizar proyecto
router.put("/:id", (req, res, next) => {
  // #swagger.tags = ['Projects']
  // #swagger.summary = 'Update a project'
  return ProjectController.updateId(req, res, next);
});

// DELETE - Eliminar proyecto
router.delete("/:id", (req, res, next) => {
  // #swagger.tags = ['Projects']
  // #swagger.summary = 'Delete a project'
  return ProjectController.destructionId(req, res, next);
});

export default router;
