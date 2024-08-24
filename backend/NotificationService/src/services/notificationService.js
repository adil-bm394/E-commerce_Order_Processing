const nodemailer = require("nodemailer");
const getOtpEmailTemplate = require("./EmailTemplate");
const serverConfig = require("../config/server-config");

require("dotenv").config();

console.log(
  "email=>",
  serverConfig.mail,
  "check password=>",
  serverConfig.pass
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: serverConfig.mail,
    pass: serverConfig.pass,
  },
});

const sendOtpEmail = (email, otp) => {
  try {
    const mailOptions = {
      from: serverConfig.mail,
      to: email,
      subject: `Order Fulfillment Notification for Order ${order._id}`,
      html: getOtpEmailTemplate(email, otp),
    };
    console.log(`Notification sent for order ${order._id}`);
    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Failed to send notification:${error}`.bgRed.white);
  }
};

module.exports = sendOtpEmail;
