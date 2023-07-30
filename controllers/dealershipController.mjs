import { db } from "../db.mjs";
import catchAsync from "../utils/catchAsync.mjs";

export const getAllCarsInDealership = catchAsync(async (req, res, next) => {
  const dealershipId = req.params.dealershipId;
  // console.log(dealershipId);
  const dealership = await db
    .collection("dealershipCollection")
    .findOne({ _id: dealershipId })
    .toArray();
  const carIds = dealership.cars;
  const cars = await db
    .collection("carCollection")
    .find({ car_id: { $in: carIds } })
    .toArray();
  res.status(200).json({
    status: "success",
    data: {
      cars,
    },
  });
});

export const createCarToDealership = catchAsync(async (req, res, next) => {
  const { dealership_id, type, name, model, car_info } = req.body;
  const existingDealership = await db
    .collection("dealershipCollection")
    .findOne({ dealership_id });

  if (existingDealership) {
    return next(new AppError("Dealership not found", 404));
  }

  const newCar = {
    type,
    name,
    model,
    car_info,
  };
  await db
    .collection("dealershipCollection")
    .updateOne({ dealership_id }, { $push: { cars: newCar } });
});
