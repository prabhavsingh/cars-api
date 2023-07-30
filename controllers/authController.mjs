import { db } from "../db.mjs";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.mjs";
import AppError from "../utils/appError.mjs";

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user.insertedId.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signUp = catchAsync(async (req, res, next) => {
  const { user_email, user_location, user_info, password } = req.body;
  const existingUser = await db
    .collection("userCollection")
    .findOne({ user_email });

  if (existingUser) {
    return next(new AppError("User with this email already exists.", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    user_email,
    user_location,
    user_info,
    password: hashedPassword,
    vehicle_info: [],
  };
  await db.collection("userCollection").insertOne(newUser);
  //   console.log("newuse", newUser.insertedId.toString());
  createSendToken(newUser, 201, res);
});
