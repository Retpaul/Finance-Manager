import { Request, Response } from "express";
import User from "../models/user";
import { LoginValidation, registerValidation } from "../validation/auth";
import { findUserByEmail } from "../services/userService";
import { comparePassword, hashPassword, signToken } from "../utils/helpers";
import config from "../config";
class CustomError extends Error {
  errors?: any;

  constructor(message: string, errors?: any) {
    super(message);
    this.errors = errors;
    Object.setPrototypeOf(this, CustomError.prototype); // Maintain correct prototype chain
  }
}

//Register user
//Method - Post
//@public
//endpoint - /api/auth/register

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { error, value } = registerValidation(req.body);

  if (error) {
    res.status(400).json({ error: error.message, errors: error.details });
    return;
  }
  const { name, email, password } = value;

  const user = await findUserByEmail(email);

  if (user) {
    res.status(400).json({ message: "Email already in use" });
    return;
  }

  const hashedPasword = await hashPassword(password);

  const newUser = await User.create({
    name,
    email,
    password: hashedPasword,
  });

  if (!newUser) {
    res.status(400);
    throw new Error("Failed to create user Account");
  }
  //   console.log(newUser)
  // sendEmail(
  //   process.env.EMAIL_USER,
  //   process.env.EMAIL_PASS,
  //   newUser.username,
  //   newUser.email,
  //   "Registration Successful"
  // );

  res.status(201).json({
    message: "User account succesfully created",
    data: { name: newUser.name, email: newUser.email, _id: newUser._id },
  });
};

//User Login
//Method - Post
//@public
//endpoint - /api/auth/login

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = LoginValidation(req.body);

  if (error) {
    res.status(400).json({ error: error.message, errors: error.details });
    return;
  }
  const { email, password } = value;

  const user = await findUserByEmail(email);

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const correctPassword = await comparePassword(
    password,
    user.password as string
  );

  if (!correctPassword) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = await signToken(user._id.toString(), email, res);

  res
    .status(200)
    .json({ token, message: "User Logged in Succesfully", data: user });
};

// export const logoutUser = (req: Request, res: Response) => {
//   res.cookie("jwt", "", {
//     httpOnly: true,
//     expires: new Date(0),
//   });
//   res.status(200).json({ message: "Logged out successfully" });
// };
