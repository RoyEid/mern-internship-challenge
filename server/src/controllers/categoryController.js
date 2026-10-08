import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const category = await Category.create({
            name
        })
        return res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Category already exists", }) //Conflict
        }
        return res.status(500).json({ message: "Failed to create category" });
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1, })
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: "Failed to get categories" })
    }
}