import express from "express";
import { getAllCars } from "../controllers/carController.mjs";

const router = express.Router();

router.get("/", getAllCars);

export default router;
