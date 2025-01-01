import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // process.env.PORT is for deployment

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
    console.log("Server is running on http://localhost:" + PORT);  
});