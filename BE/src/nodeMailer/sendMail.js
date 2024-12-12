import { transporter } from './transporter.js'
import 'dotenv/config.js'

export const sendEmail = async (to,subject,html)=>{

        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            html
        };
        return transporter.sendMail(mailOptions)

}