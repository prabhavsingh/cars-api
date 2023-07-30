import express from "express";
import { getAllCarsInDealership } from "../controllers/dealershipController.mjs";

const router = express.Router();

router
  .route("/:dealershipId")
  .get(getAllCarsInDealership)
  .get(createCarToDealership);

export default router;
