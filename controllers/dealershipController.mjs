import { ObjectId } from "mongodb";
import { db } from "../db.mjs";
import catchAsync from "../utils/catchAsync.mjs";
import AppError from "../utils/appError.mjs";

export const getAllCarsInDealership = catchAsync(async (req, res, next) => {
  const dealershipId = new ObjectId(req.params.dealershipId);
  console.log(dealershipId);
  const dealership = await db
    .collection("dealershipCollection")
    .findOne({ _id: dealershipId });

  if (!dealership) {
    return next(new AppError("Dealership not found", 404));
  }
  const carIdsArray = dealership.cars.map((car) => car.car_id);
  console.log(carIdsArray);
  const cars = await db
    .collection("carCollection")
    .find({ _id: { $in: carIdsArray } })
    .toArray();
  res.status(200).json({
    status: "success",
    results: carIdsArray.length,
    data: {
      cars,
    },
  });
});

export const getCarSoldByDealership = catchAsync(async (req, res, next) => {
  const dealershipId = new ObjectId(req.params.dealershipId);
  console.log(dealershipId);
  const dealership = await db
    .collection("dealershipCollection")
    .findOne({ _id: dealershipId });

  if (!dealership) {
    return next(new AppError("Dealership not found", 404));
  }

  // Get the IDs of all cars sold by the dealership
  const soldCarIds = dealership.sold_vehicles.map(
    (vehicle) => vehicle.vehicle_id
  );
  // console.log(soldCarIds);
  // Fetch the details of the sold cars from the cars collection
  const soldCars = await db
    .collection("soldVehicleCollection")
    .find({ _id: { $in: soldCarIds } })
    .toArray();
  // console.log(soldCars);
  res.status(200).json({
    status: "success",
    results: soldCarIds.length,
    data: {
      soldCars,
    },
  });
});

export const addCarToDealership = catchAsync(async (req, res, next) => {
  const dealershipId = req.params.dealershipId;
  const existingDealership = await db
    .collection("dealershipCollection")
    .findOne({ _id: dealershipId });

  if (!existingDealership) {
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

  await db.collection("carsCollection").insertOne(newCar);
});
