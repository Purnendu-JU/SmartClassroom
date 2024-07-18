const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: 'purnendukumarmisra9@gmail.com',
        pass: process.env.PASS
    }
});
const sendEmail = (to, subject, text) => {
    let toAddresses = Array.isArray(to) ? to.join(', ') : to;
    const mailOptions = {
        from: {
            name: 'Smart Classroom App',
            address: 'purnendukumarmisra9@gmail.com'
        },
        to: toAddresses,
        subject,
        text
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
};
module.exports = sendEmail;
