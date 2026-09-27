import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        mobileNumber: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }

);

const Item = mongoose.model("Item", itemSchema);

export default Item;