import express from "express";
import {
  getAllCarsInDealership,
  getCarSoldByDealership,
} from "../controllers/dealershipController.mjs";

const router = express.Router();

router.route("/:dealershipId/cars").get(getAllCarsInDealership);

router.route("/:dealershipId/sold-cars").get(getCarSoldByDealership);

export default router;
