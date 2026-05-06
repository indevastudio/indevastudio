// api/contact.js
// vercel serverless function — receives lead form submissions from city pages
// and emails them via resend. uses RESEND_API_KEY from vercel env vars.

export default async function handler(req, res) {
  // CORS for safety (only allow same-origin in practice via vercel)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  const body = req.body || {};
  const { name, phone, city, propertyType, budget, message, source, hp } = body;

  // honeypot field — if filled, it's a bot
  if (hp) return res.status(200).json({ success: true });

  // validation
  if (!name || !phone) {
    return res.status(400).json({ error: 'name and phone are required' });
  }
  if (
    String(name).length > 100 ||
    String(phone).length > 30 ||
    (message && String(message).length > 2000)
  ) {
    return res.status(400).json({ error: 'invalid input' });
  }

  // basic phone sanity check
  const phoneClean = String(phone).replace(/[^\d+]/g, '');
  if (phoneClean.length < 8) {
    return res.status(400).json({ error: 'phone number looks invalid' });
  }

  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 600px; color: #1a1a1a;">
      <div style="border-bottom: 2px solid #b89a6a; padding-bottom: 12px; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 22px;">new project enquiry</h2>
        <p style="margin: 4px 0 0; color: #777; font-size: 13px;">submitted ${submittedAt} IST · source: ${escapeHtml(source || 'unknown')}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 0; font-weight: 600; width: 140px; vertical-align: top;">name</td><td style="padding: 10px 0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 10px 0; font-weight: 600; vertical-align: top; border-top: 1px solid #eee;">phone</td><td style="padding: 10px 0; border-top: 1px solid #eee;"><a href="tel:${escapeHtml(phoneClean)}" style="color: #1a1a1a;">${escapeHtml(phone)}</a> · <a href="https://wa.me/${escapeHtml(phoneClean.replace(/\+/g, ''))}" style="color: #b89a6a;">whatsapp ↗</a></td></tr>
        <tr><td style="padding: 10px 0; font-weight: 600; vertical-align: top; border-top: 1px solid #eee;">city</td><td style="padding: 10px 0; border-top: 1px solid #eee;">${escapeHtml(city || '—')}</td></tr>
        <tr><td style="padding: 10px 0; font-weight: 600; vertical-align: top; border-top: 1px solid #eee;">property type</td><td style="padding: 10px 0; border-top: 1px solid #eee;">${escapeHtml(propertyType || '—')}</td></tr>
        <tr><td style="padding: 10px 0; font-weight: 600; vertical-align: top; border-top: 1px solid #eee;">budget range</td><td style="padding: 10px 0; border-top: 1px solid #eee;">${escapeHtml(budget || '—')}</td></tr>
      </table>

      ${message ? `
        <div style="margin-top: 24px; padding: 16px 20px; background: #faf8f4; border-left: 3px solid #b89a6a;">
          <p style="margin: 0 0 6px; font-weight: 600; font-size: 13px; color: #555;">message</p>
          <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      ` : ''}

      <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; color: #888; font-size: 12px;">indéva studio · lead notification</p>
    </div>
  `;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'indéva studio <hello@indevastudio.com>',
        to: ['ceo@indevastudio.com'],
        reply_to: 'hello@indevastudio.com',
        subject: `new lead — ${name}${city ? ` · ${city}` : ''}${budget ? ` · ${budget}` : ''}`,
        html,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('resend error:', r.status, errText);
      return res.status(500).json({ error: 'failed to send' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('contact handler error:', error);
    return res.status(500).json({ error: 'failed to send' });
  }
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}
