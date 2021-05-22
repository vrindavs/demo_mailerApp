
 const nodemailer = require("nodemailer");

 const poolConfig1 = {
   pool: true,
   host: 'smtp.gmail.com',
   port: 465,
   pool: true,
   auth: {
     user: "vrindavs2020@gmail.com",
     pass: "vrinda2020@",
   },
   secureConnection: false,
   tls: { ciphers: "SSLv3" },
 };
 
 async function email(mailOptions, receipt) {
   return new Promise((resolve) => {
     const transporter = nodemailer.createTransport(
       poolConfig1
     );
     mailOptions.from = "vrindavs2020@gmail.com";
 
     transporter.sendMail(mailOptions, function (error, info) {
       if (error) {
         console.log("Email error", error);
         resolve({ status: false, response: error });
       } else {
         console.log("Email sent: " + info.response);
         resolve({ status: true, response: info.response });
       }
     });
   });
 }
 
 module.exports.email = email;
 