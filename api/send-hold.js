// api/send-hold.js - Secure Brevo email sender
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const body = req.body;

  try {
    // Customer email
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
          <h1 style="color:#006b33;">Hold Confirmed!</h1>
          <p>Dear Guest,</p>
          <p>Thank you for choosing Cruising DownUnder!</p>
          <div style="background:#e8f5e8; padding:25px; border-radius:12px; margin:25px 0; text-align:center;">
            <h2>${body.cruise_name}</h2>
            <strong>Cabin: ${body.cabin_type}</strong><br>
            <strong>Guests: ${body.guests}</strong><br>
            <strong>Total: ${body.total_price}</strong>
          </div>
          <p>Contact: ${body.customer_email} • ${body.customer_phone}</p>
          <p>Our team will contact you soon.</p>
          <p>Best regards,<br>Cruising DownUnder Team</p>
        `
      })
    });

    // Admin email (to you)
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Cruising DownUnder Booking Alert', email: 'info@crusingdownunder.com.au' },
        to: [{ email: 'calebalt000@gmail.com' }], // CHANGE THIS TO YOUR REAL EMAIL
        subject: `NEW HOLD – ${body.cruise_name} – ${body.total_price}`,
        htmlContent: `
          <h1>New Hold Booking</h1>
          <p>From: ${body.customer_email} • ${body.customer_phone}</p>
          <p>Cruise: ${body.cruise_name}</p>
          <p>Cabin: ${body.cabin_type}</p>
          <p>Guests: ${body.guests}</p>
          <p>Total: ${body.total_price}</p>
          <p>Action: Send payment link.</p>
        `
      })
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
