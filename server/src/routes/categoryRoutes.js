import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import { validateCreateCategory } from "../validators/categoryValidator.js"

const router = express.Router();

router.post("/", validateCreateCategory, createCategory)
router.get("/", getCategories);

export default router;