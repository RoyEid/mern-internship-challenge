import express from "express";
import { createItem, getItems, updateItem, deleteItem } from "../controllers/itemController.js";
import { validateCreateItem, validateUpdateItem, validateItemId } from "../validators/itemValidator.js";

const router = express.Router();

router.post("/", validateCreateItem, createItem);
router.get("/", validateItemId, getItems);
router.put("/:id", validateItemId, validateUpdateItem, updateItem);
router.delete("/:id", validateItemId, deleteItem);

export default router;

