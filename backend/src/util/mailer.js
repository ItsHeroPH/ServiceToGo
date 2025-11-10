import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export function sendEmail(to, subject, html, text) {
    transporter.sendMail({
        from: `"ServiceToGo" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text,
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../assets/logo.png"),
                cid: "logo"
            }
        ]
    })
}