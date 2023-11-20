const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const nodemailer = require("nodemailer");

// Allow requests from any origin for development. Update this in production.
app.use(cors());

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
    const transporter = nodemailer.createTransport({
      service: "gmail", // e.g., 'gmail'
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "FaithFull Steward <support@yourcompany.com>", // Replace with your company's name and support email
      to: email, // The email of the user who purchased the tickets
      subject: "Thank you for your order",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2>Dear ${firstName} ${lastName},</h2>
          <p>Thank you for the order you recently placed for tickets to the event <strong>2024 FaithFull Steward Conference (Expository Preaching)</strong> (on Saturday April 13).</p>
          
          <h3>Your tickets</h3>
          <p>Please bring these tickets with you to the event. Personal details such as your address may be used for verification on entry.</p>
          
          <h3>Order summary</h3>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Item</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Fee</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Subtotal</th>
            </tr>
            <!-- Replace the ticket details with your actual order details -->
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">FaithFull Steward Registration</td>
              <td style="border: 1px solid #ddd; padding: 8px;">40.00</td>
              <td style="border: 1px solid #ddd; padding: 8px;">3.00</td>
              <td style="border: 1px solid #ddd; padding: 8px;">1</td>
              <td style="border: 1px solid #ddd; padding: 8px;">43.00</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Transaction charge</td>
              <td style="border: 1px solid #ddd; padding: 8px;">2.00</td>
              <td style="border: 1px solid #ddd; padding: 8px;">0.00</td>
              <td style="border: 1px solid #ddd; padding: 8px;">1</td>
              <td style="border: 1px solid #ddd; padding: 8px;">2.00</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Total</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>USD43.00</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;"></td>
              <td style="border: 1px solid #ddd; padding: 8px;"></td>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>USD43.00</strong></td>
            </tr>
          </table>
          
          <h3>Event details</h3>
          <p>
            Event name: 2024 FaithFull Steward Conference (Expository Preaching)<br>
            Event date: Thu April 14, 2024 10:00Am<br>
            Venue: Sacramento California<br>
     
          </p>
    
          <p>Need help or have questions? Contact the event organizer <a href="mailto:williamvelichko2003@gmail.com">here</a>.</p>
          <p>Looking forward to seeing you at the conference!</p>
          <div style="background-color: #f5f5f5; padding: 20px; margin-top: 30px;">
            <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `,
    };

    // Create a customer in Stripe and get the customer ID
    const customer = await stripe.customers.create({
      email: email,
      name: `${firstName} ${lastName}`,
      phone: phone,
      address: {
        line1: streetAddress,
        city: city,
        state: state,
        postal_code: zipCode,
        country: "US", // Update with the appropriate country code
      },
    });

    // Create a PaymentIntent and associate it with the customer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 4000, // Use the actual amount if it's fixed, or calculate dynamically based on product details
      currency: "USD",
      description: "Preacher Conference",
      payment_method: id,
      payment_method_types: ["card"],
      confirm: true,
      customer: customer.id,
      setup_future_usage: "off_session", // Optional: Allow off-session payments
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

    console.log("PaymentIntent", paymentIntent);

    // Handle successful payment

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
