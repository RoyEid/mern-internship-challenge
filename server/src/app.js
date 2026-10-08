import express from "express";
import cors from "cors";

import itemRoutes from "./routes/itemRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
   return res.status(200).json({ message: "Main API is running" })
});

app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);

export default app;