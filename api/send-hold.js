// api/send-hold.js - Sends both customer & admin emails via Brevo
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const body = req.body;

  try {
    // 1. Customer Confirmation Email
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Cruising DownUnder Team', email: 'info@crusingdownunder.com.au' },
        to: [{ email: body.to_email }],
        subject: `Your Cabin Hold Confirmed – ${body.cruise_name}`,
        htmlContent: `
          <h1 style="color:#006b33; font-family:Playfair Display,serif;">Hold Confirmed!</h1>
          <p>Dear Valued Guest,</p>
          <p>Thank you for choosing Cruising DownUnder. Your cabin is now held for 48 hours.</p>
          <div style="background:#e8f5e8; padding:25px; border-radius:12px; margin:25px 0; text-align:center;">
            <h2>${body.cruise_name}</h2>
            <strong>Cabin: ${body.cabin_type}</strong><br>
            <strong>Guests: ${body.guests}</strong><br>
            <strong>Total: ${body.total_price}</strong>
          </div>
          <p>Contact: ${body.customer_email} • ${body.customer_phone}</p>
          <p>Our team will contact you soon with payment instructions.</p>
          <p>Best regards,<br>Cruising DownUnder Team</p>
        `
      })
    });

    // 2. Admin Notification (to you)
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Cruising DownUnder Booking Alert', email: 'info@crusingdownunder.com.au' },
        to: [{ email: 'calebkeenan173@gmail.com' }],
        subject: `NEW HOLD BOOKING – ${body.cruise_name} – ${body.total_price}`,
        htmlContent: `
          <h1>New Hold Booking</h1>
          <p><strong>From:</strong> ${body.customer_email} • ${body.customer_phone}</p>
          <p><strong>Cruise:</strong> ${body.cruise_name}</p>
          <p><strong>Cabin:</strong> ${body.cabin_type}</p>
          <p><strong>Guests:</strong> ${body.guests}</p>
          <p><strong>Total:</strong> ${body.total_price}</p>
          <p><strong>Next:</strong> Contact customer and confirm booking.</p>
        `
      })
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Brevo error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}
