import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Joi from "joi";
import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
  name: Joi.string().required(),
  role: Joi.string().valid("client", "lawyer").required(),
  expertise: Joi.string().optional(),
});

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, error: error.details[0].message });
    return;
  }

  const { email, phone, name, role, expertise } = value;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      res.status(400).json({ success: false, error: "User already exists" });
      return;
    }

    const user = new User({ email, phone, name, role, expertise });
    await user.save();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await twilioClient.messages.create({
      body: `Your Adhivakta OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });

    res.status(201).json({ success: true, data: { userId: user._id, otp } });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, otp } = req.body;

  const simulatedOtp = "123456"; // Replace with actual OTP check in production
  if (otp !== simulatedOtp) {
    res.status(400).json({ success: false, error: "Invalid OTP" });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.status(200).json({ success: true, data: { message: "Phone verified" } });
  } catch (error) {
    next(error);
  }
};