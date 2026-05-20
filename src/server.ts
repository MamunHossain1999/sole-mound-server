import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();

connectDB();

export default app;