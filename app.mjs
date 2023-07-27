import express from "express";
import carRouter from "./routes/carRouter.mjs";
import AppError from "./utils/appError.mjs";
import globalErrorHandler from "./controllers/errorController.mjs";

const app = express();
app.use(express.json());

app.use("/api/v1/cars", carRouter);
// app.use("/api/v1/dealerships", dealershipRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/deals", dealRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
export default app;
