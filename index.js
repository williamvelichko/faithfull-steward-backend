const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const nodemailer = require("nodemailer");
const emailTemplate = require("./emailTemplate");
app.use(cors());

const QRCode = require("qrcode");

const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data);
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to the FaithFull Steward Server!");
});

app.post("/payment", cors(), async (req, res) => {
  let {
    amount,
    id,
    firstName,
    lastName,
    email,
    phone,
    streetAddress,
    city,
    state,
    zipCode,
  } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: email,
      name: `${firstName} ${lastName}`,
      phone: phone,
      address: {
        line1: streetAddress,
        city: city,
        state: state,
        postal_code: zipCode,
        country: "US",
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,
      currency: "USD",
      description: "Preacher Conference",
      payment_method: id,
      payment_method_types: ["card"],
      confirm: true,
      customer: customer.id,
      setup_future_usage: "off_session",
      receipt_email: email,
      metadata: {
        firstName,
        lastName,
        email,
        phone,
        streetAddress,
        city,
        state,
        zipCode,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "FaithFull Steward <support@yourcompany.com>", // Replace with your company's name and support email
      to: email, // The email of the user who purchased the tickets
      subject: "Thank you for your order",
      html: emailTemplate(firstName, lastName, email, qrCodeDataURL),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      success: true,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({
      error: "Payment failed",
      success: false,
    });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is listening on port 4000");
});
