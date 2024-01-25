module.exports = (firstName, lastName, email) => `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
<h2>Dear ${firstName} ${lastName},</h2>
<p>Thank you for the order you recently placed for tickets to the event <strong>2024 FaithFull Steward Conference (Faithful Preaching)</strong> (on Saturday April 13).</p>

<h3>Your tickets</h3>
<p>Please bring these tickets with you to the event. Personal details such as your address may be used for verification on entry.</p>

<h3>Order summary</h3>
<table style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px;">Item</th>
    <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
    <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
    <th style="border: 1px solid #ddd; padding: 8px;">Subtotal</th>
  </tr>
  <!-- Replace the ticket details with your actual order details -->
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">FaithFull Steward Registration</td>
    <td style="border: 1px solid #ddd; padding: 8px;">40.00</td>
    <td style="border: 1px solid #ddd; padding: 8px;">1</td>
    <td style="border: 1px solid #ddd; padding: 8px;">40.00</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Total</strong></td>
    <td style="border: 1px solid #ddd; padding: 8px;"><strong>USD40.00</strong></td>
    <td style="border: 1px solid #ddd; padding: 8px;"></td>
    <td style="border: 1px solid #ddd; padding: 8px;"><strong>USD40.00</strong></td>
  </tr>
</table>

<h3>Event details</h3>
<p>
  Event name: 2024 FaithFull Steward Conference (Faithful Preaching)<br>
  Event date: Thu April 13, 2024 10:00Am<br>
  Venue: Sacramento California<br>

</p>

<p>Need help or have questions? Contact the event organizer <a href="mailto:williamvelichko2003@gmail.com">here</a>.</p>
<p>Looking forward to seeing you at the conference!</p>
<div style="background-color: #f5f5f5; padding: 20px; margin-top: 30px;">

  <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply.</p>
</div>
</div>
`;
