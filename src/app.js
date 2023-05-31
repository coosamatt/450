import express from "express";
import mongoose from "mongoose";
import config from "../config.js";

const app = express();

//db
const db = config.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB successfully!");
  } catch (error) {
    console.log("DB connection error!", error);
  }
};

connectDB();


//routes

export default app;
