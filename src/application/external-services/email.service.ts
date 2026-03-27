import nodemailer from "nodemailer"
import "dotenv/config"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export async function sendEmail(to: string, subject: string, text: string) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        })
        console.log("✅ Email enviado!")
    } catch (error) {
        console.error(`Erro ao enviar email para ${to}:`, error)
    }
}