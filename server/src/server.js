import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "../src/config/db.js"

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Main API is running" });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Main API is running on port ${PORT}`)
})