import express from "express";
import carRouter from "./routes/carRouter.mjs";

const app = express();
app.use(express.json());

app.use("/api/v1/cars", carRouter);
export default app;
