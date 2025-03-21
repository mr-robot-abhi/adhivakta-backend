import { messaging } from "./firebaseAdmin";
import nodemailer from "nodemailer";
import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const sendPushNotification = async (token: string, title: string, body: string) => {
  await messaging.send({ token, notification: { title, body } });
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
};

export const sendSMS = async (to: string, body: string) => {
  await twilioClient.messages.create({ body, from: process.env.TWILIO_PHONE, to });
};