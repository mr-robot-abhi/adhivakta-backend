import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { sendPushNotification, sendEmail, sendSMS } from "../utils/notificationUtils";

export const sendNotification = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, title, body } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    await sendPushNotification("user-device-token", title, body); // Replace with real token
    await sendEmail(user.email, title, body);
    await sendSMS(user.phone, body);

    res.status(200).json({ success: true, data: { message: "Notification sent" } });
  } catch (error) {
    next(error);
  }
};