import Item from "../models/Item.js";
import { validatePhoneNumber } from "../services/phoneService.js"

export const createItem = async (req, res) => {
    const { name, description, mobileNumber } = req.body;

    try {
        if (mobileNumber) {
            await validatePhoneNumber(mobileNumber);
        }

        const item = await Item.create({
            name,
            description,
            mobileNumber: mobileNumber || null
        })

        return res.status(201).json(item);
    } catch (error) {
        if (error.response?.status === 400) {
            return res.status(400).json({ message: "Invalid mobile number" });
        }
        return res.status(500).json({ message: "Failed to create item" })
    }
}

export const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({ message: "Failed to get items" })
    }
}

export const updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, mobileNumber } = req.body;
    try {
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" })
        }

        if (mobileNumber && mobileNumber !== item.mobileNumber) {
            await validatePhoneNumber(mobileNumber);
        }

        item.name = name ?? item.name;
        item.description = description ?? item.description;
        item.mobileNumber = mobileNumber !== undefined ? mobileNumber || null : item.mobileNumber;

        const updatedItem = await item.save();
        return res.status(200).json(updatedItem);

    } catch (error) {
        if (error.response?.status === 400) {
            return res.status(400).json({ message: "Invalid mobile number" })
        }
        res.status(500).json({ message: "Failed to update item" })
    }
}


export const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findByIdAndDelete(id);

        if (!item) {
            res.status(404).json({ message: "Id not found" })
        }

        return res.status(200).json({ message: "Item deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete item" })
    }
} 