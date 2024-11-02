import express, { json } from "express";
import { userRouter } from "./routes/user.js";
import "./config/dotenv.js";
import "./config/dynamoose.js";

const PORT = process.env.PORT || 5001;
const app = express();
app.use(json());
app.use("/api/users", userRouter);
app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
