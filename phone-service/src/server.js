import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // read the values like process...

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Phone validation service is running" });
});

app.post("/api/phone/validate", async (req, res) => {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
        return res.status(400).json({ message: "Mobile number is required" });
    }

    try {
        const response = await axios.get(process.env.VERIPHONE_API_URL, {
            params: {
                phone: mobileNumber,
            },
            headers: {
                Authorization: `Bearer ${process.env.VERIPHONE_API_KEY}`,
            }
        })

        const data = response.data;

        if (!data.phone_valid) {
            return res.status(400).json({ message: "Invalid mobile number" });
        }
        return res.status(200).json({
            countryCode: data.country_code,
            countryName: data.country,
            operatorName: data.carrier
        })
    }
    catch (error) {
        return res.status(500).json({ message: "Phone validation service failed" })
    }
})

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Phone service running on port ${PORT}`);
});