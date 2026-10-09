import ProjectModel from "../models/projectModel.js";
import AsyncWrapper from "../utils/AsyncWrapper.js";
import { Api400Error, Api404Error } from "../utils/custom_error/apiError.js";

// CREATE - Crear proyecto
const create = AsyncWrapper.wrapAsync(async (req, res) => {
  if (typeof req.body.name !== "string" || !req.body.name.trim()) {
    throw new Api400Error(
      "Invalid Name",
      undefined,
      "Project name is required",
    );
  }

  const lastProject = await ProjectModel.findOne().sort({ id: -1 });

  const newId = lastProject ? lastProject.id + 1 : 1;

  const project = await ProjectModel.create({
    id: newId,
    name: req.body.name.trim(),
    description: req.body.description,
    status: req.body.status,
    manager: req.body.manager,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    budget: req.body.budget,
    active: req.body.active,
  });

  res.status(201).json(project);
});

// GET - Listar proyectos
const findAll = AsyncWrapper.wrapAsync(async (req, res) => {
  const projects = await ProjectModel.find({}, { _id: 0 });
  res.json(projects);
});

// GET - Buscar proyecto por ID
const findOne = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    throw new Api400Error(
      "Invalid ID",
      undefined,
      "Project ID must be a positive integer",
    );
  }

  const project = await ProjectModel.findOne({ id });

  if (!project) {
    throw new Api404Error(
      "Project Not Found",
      undefined,
      `Project with ID ${id} not found`,
    );
  }

  res.json(project);
});

// PUT - Actualizar proyecto
const updateId = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    throw new Api400Error(
      "Invalid ID",
      undefined,
      "Project ID must be a positive integer",
    );
  }

  const allowed = [
    "name",
    "description",
    "status",
    "manager",
    "startDate",
    "endDate",
    "budget",
    "active",
  ];

  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key)),
  );

  const project = await ProjectModel.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true, runValidators: true },
  );

  if (!project) {
    throw new Api404Error(
      "Project Not Found",
      undefined,
      `Project with ID ${id} not found`,
    );
  }

  res.json(project);
});

// DELETE - Eliminar proyecto
const destructionId = AsyncWrapper.wrapAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    throw new Api400Error(
      "Invalid ID",
      undefined,
      "Project ID must be a positive integer",
    );
  }

  const project = await ProjectModel.findOneAndDelete({ id });

  if (!project) {
    throw new Api404Error(
      "Project Not Found",
      undefined,
      `Project with ID ${id} not found`,
    );
  }

  res.json({
    message: "Project deleted successfully!",
  });
});

export default {
  create,
  findAll,
  findOne,
  updateId,
  destructionId,
};
