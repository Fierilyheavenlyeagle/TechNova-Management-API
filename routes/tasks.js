
import express from "express";
import TaskController from "../controllers/taskController.js";

const router = express.Router();


router.get("/", TaskController.findAll);


router.get("/:id", TaskController.findOne);


router.post("/", TaskController.create);

router.put("/:id", TaskController.updateId);

router.delete("/:id", TaskController.destructionId);

export default router;
