import express from "express";
import departmentController from "../controllers/departments.js";

const router = express.Router();
// Rutas para el CRUD de departamentos
router.post("/", departmentController.create);
router.get("/", departmentController.findAll);
router.get("/:id", departmentController.findOne);
router.put("/:id", departmentController.updateId);
router.delete("/:id", departmentController.destructionId);

export default router;
