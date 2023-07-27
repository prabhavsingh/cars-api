import { db } from "../db.mjs";

export const getAllCars = async (req, res) => {
  try {
    const cars = await db.collection("carCollection").find().toArray();
    res.status(200).json({
      status: "success",
      data: {
        cars,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fatl",
      data: {
        error,
      },
    });
  }
};
