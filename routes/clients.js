
import express from "express";
import ClientController from "../controllers/clientController.js";

const router = express.Router();


router.get("/", ClientController.findAll);


router.get("/:id", ClientController.findOne);


router.post("/", ClientController.create);


router.put("/:id", ClientController.updateId);


router.delete("/:id", ClientController.destructionId);

export default router;
