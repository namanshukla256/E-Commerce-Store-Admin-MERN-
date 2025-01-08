import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // process.env.PORT is for deployment

app.use(express.json()); // allows you to parse incoming JSON data
app.use(cookieParser()); 

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);  
    connectDB();
});
