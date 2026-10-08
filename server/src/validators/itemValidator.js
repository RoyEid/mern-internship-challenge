import mongoose from "mongoose";

export const validateCreateItem = (req, res, next) => {
    const { name, description, mobileNumber } = req.body;

    if (!name?.trim()) {
        return res.status(400).json({ message: "Name is required" })
    }

    if (!description?.trim()) {
        return res.status(400).json({ message: "Description is required" })
    }

    if (mobileNumber !== undefined && typeof mobileNumber !== "string") {
        return res.status(400).json({ message: "Mobile number must be a string" })
    }
    next();
}

export const validateUpdateItem = (req, res, next) => {
    const { name, description, mobileNumber } = req.body;

    if (name !== undefined && !name.trim()) {
        return res.status(400).json({ message: "Name cannot be empty" })
    }

    if (description !== undefined && !description.trim()) {
        return res.status(400).json({ message: "Description cannot be empty" })
    }

    if (mobileNumber !== undefined && typeof mobileNumber !== "string") {
        return res.status(400).json({ message: "Mobile number must be a string" })
    }
    next();
}

export const validateItemId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid item ID" })
    }
    next();
}