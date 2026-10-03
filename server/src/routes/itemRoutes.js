import express from "express";
import { createItem, getItems, updateItem, deleteItem } from "../controllers/itemController.js";

const router = express.Router();

router.post("/", createItem);
router.get("/", getItems);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;

