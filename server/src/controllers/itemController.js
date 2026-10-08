import Item from "../models/Item.js";
import Category from "../models/Category.js";

import {
    validatePhoneNumber,
} from "../services/phoneService.js";

export const createItem = async (req, res) => {
    const {
        name,
        description,
        mobileNumber,
        category,
    } = req.body;

    try {
        const categoryExists =
            await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        if (mobileNumber) {
            await validatePhoneNumber(mobileNumber);
        }

        const item = await Item.create({
            name,
            description,
            mobileNumber: mobileNumber || null,
            category,
        });

        await item.populate(
            "category",
            "name",
        );

        return res.status(201).json(item);
    } catch (error) {
        if (error.response?.status === 400) {
            return res.status(400).json({
                message: "Invalid mobile number",
            });
        }

        if (error.response?.status === 503) {
            return res.status(503).json({
                message:
                    "Phone validation service is unavailable",
            });
        }

        return res.status(500).json({
            message: "Failed to create item",
        });
    }
};

export const getItems = async (req, res) => {
    try {
        const items = await Item.find()
            .populate("category", "name");

        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get items",
        });
    }
};

export const updateItem = async (req, res) => {
    const { id } = req.params;

    const {
        name,
        description,
        mobileNumber,
        category,
    } = req.body;

    try {
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

        if (category !== undefined) {
            const categoryExists =
                await Category.findById(category);

            if (!categoryExists) {
                return res.status(404).json({
                    message: "Category not found",
                });
            }

            item.category = category;
        }

        if (
            mobileNumber &&
            mobileNumber !== item.mobileNumber
        ) {
            await validatePhoneNumber(
                mobileNumber,
            );
        }

        item.name = name ?? item.name;

        item.description =
            description ?? item.description;

        item.mobileNumber =
            mobileNumber !== undefined
                ? mobileNumber || null
                : item.mobileNumber;

        const updatedItem =
            await item.save();

        await updatedItem.populate(
            "category",
            "name",
        );

        return res
            .status(200)
            .json(updatedItem);
    } catch (error) {
        if (error.response?.status === 400) {
            return res.status(400).json({
                message: "Invalid mobile number",
            });
        }

        if (error.response?.status === 503) {
            return res.status(503).json({
                message:
                    "Phone validation service is unavailable",
            });
        }

        return res.status(500).json({
            message: "Failed to update item",
        });
    }
};

export const deleteItem = async (
    req,
    res,
) => {
    const { id } = req.params;

    try {
        const item =
            await Item.findByIdAndDelete(id);

        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

        return res.status(200).json({
            message:
                "Item deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete item",
        });
    }
};