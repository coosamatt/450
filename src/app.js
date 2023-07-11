import express from "express";
import routes from "../src/routes/routes.js";

const app = express();

//db
// const db = config.MONGODB_URI;

// const connectDB = async () => {
//   try {
//     await mongoose.connect(db, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to DB successfully!");
//   } catch (error) {
//     console.log("DB connection error!", error);
//   }
// };

// connectDB();

//routes
app.use(routes);

export default app;
