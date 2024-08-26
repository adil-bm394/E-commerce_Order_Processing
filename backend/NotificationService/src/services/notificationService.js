const nodemailer = require("nodemailer");
const serverConfig = require("../config/serverConfig");
const getNotificationTemplate = require("./emailTemplate");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: serverConfig.mail,
    pass: serverConfig.pass,
  },
});

const sendNotification = (user ,product) => {
  console.log("dfghj",user.email);
  try {
    const mailOptions = {
      from: serverConfig.mail,
      to: user.email,
      subject: `Order Fulfillment Notification for Order ${product}`,
      html: getNotificationTemplate(user.name, product),
    };
    console.log(`Notification sent for order ${product}`);
    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`[Notification Service]Failed to send notification:${error}`.bgRed.white);
  }
};

module.exports = sendNotification;
