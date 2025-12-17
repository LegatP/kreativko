"use server";

import { sendMail } from "@/lib/nodemailer/mail";

export async function sendMailNotification(subject: string, body: string) {
  await sendMail(subject, body);
}
