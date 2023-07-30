import { db } from "../db.mjs";
import catchAsync from "../utils/catchAsync.mjs";

export const getAllCars = catchAsync(async (req, res) => {
  const cars = await db.collection("carCollection").find().toArray();
  res.status(200).json({
    status: "success",
    data: {
      cars,
    },
  });
});
