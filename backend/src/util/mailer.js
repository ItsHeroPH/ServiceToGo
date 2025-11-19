import nodemailer from "nodemailer";
import logger from "./logger.js";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
})

export async function sendEmail(to, subject, html, text) {
    try {
        await transporter.sendMail({
            from: `"ServiceToGo" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            text
        })
        return true;
    } catch(e) {
        logger.error("EMAIL", e);
        return false;
    }
}