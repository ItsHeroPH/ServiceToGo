import nodemailer from "nodemailer";

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
        text
    })
}