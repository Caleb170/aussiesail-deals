// api/send-hold.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
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
        htmlContent: `<h1>Hold Confirmed!</h1><p>Details for ${body.cruise_name} - ${body.cabin_type} - ${body.guests} guests - ${body.total_price}</p>`
      })
    });

    if (!response.ok) throw new Error('Brevo send failed');

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
