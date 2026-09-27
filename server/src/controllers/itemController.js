import axios from "axios";
import Item from "../models/Item.js";

export const createItem = async (req, res) => {
    const { name, description, mobileNumber } = req.body;


    if (!name || !description) {
        return res.status(400).json({ message: "Name and description are required" });
    }
    try {

        if (mobileNumber) {
            await axios.post(`${process.env.PHONE_SERVICE_URL}/api/phone/validate`, {
                mobileNumber
            }
            );
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