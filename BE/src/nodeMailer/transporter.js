import nodemailer from 'nodemailer'
import 'dotenv/config.js'

export const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    },
});