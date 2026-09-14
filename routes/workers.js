import express from "express";
import workers from "../controllers/workers.js";
import { auth } from "../middleware/auth.js";
// Rutas para el CRUD de trabajadores
const routes = express.Router();

/**
 * @swagger
 * /workers:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: Get all workers
 *     responses:
 *       200:
 *         description: List of workers
 *       401:
 *         description: Unauthorized
 */
routes.get("/", auth, workers.findAll);

/**
 * @swagger
 * /workers/{id}:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: Get worker by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Worker found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
routes.get("/:id", auth, workers.findOne);

/**
 * @swagger
 * /workers:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: Create worker
 */
routes.post("/", auth, workers.create);

/**
 * @swagger
 * /workers/{id}:
 *   put:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: Update worker
 */
routes.put("/:id", auth, workers.updateId);

/**
 * @swagger
 * /workers/{id}:
 *   delete:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: Delete worker
 */
routes.delete("/:id", auth, workers.destructionId);

export default routes;
