const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');



let transporter =nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure: false,
    auth:{
        user:testAccount.user,
        pass:testAccount.pass,
    },
    


})

console.log('checll',transporter)
module.exports = transporter