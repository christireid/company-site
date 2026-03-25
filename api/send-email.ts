import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, org, interest, message } = req.body ?? {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, message' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Email service not configured' })
  }

  // ── Sender / recipient config ────────────────────────────────────────────
  // FROM: must be from a domain verified in Resend (resend.com/domains).
  //   • Before domain verification, use "onboarding@resend.dev" (test only).
  //   • After verifying codeclarity.ai, set EMAIL_FROM in Vercel env vars:
  //       EMAIL_FROM = Code & Clarity <hello@codeclarity.ai>
  // TO: where contact form submissions land.
  const FROM = process.env.EMAIL_FROM ?? 'Code & Clarity <onboarding@resend.dev>'
  const TO   = process.env.EMAIL_TO   ?? 'christi@codeclarity.ai'
  // ────────────────────────────────────────────────────────────────────────

  const subject = `New enquiry from ${name}${org ? ` · ${org}` : ''}`

  const html = `
    <table style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;max-width:600px">
      <tr><td><h2 style="margin:0 0 20px">New enquiry via Code &amp; Clarity</h2></td></tr>
      <tr><td><strong>Name:</strong> ${escHtml(name)}</td></tr>
      <tr><td><strong>Email:</strong> <a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
      ${org      ? `<tr><td><strong>Organisation:</strong> ${escHtml(org)}</td></tr>` : ''}
      ${interest ? `<tr><td><strong>Exploring:</strong> ${escHtml(interest)}</td></tr>` : ''}
      <tr><td style="padding-top:16px"><strong>Message:</strong><br>${escHtml(message).replace(/\n/g, '<br>')}</td></tr>
    </table>
  `

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, html }),
    })

    if (!resendRes.ok) {
      const detail = await resendRes.json().catch(() => ({}))
      console.error('Resend error:', detail)
      return res.status(502).json({ error: 'Failed to send email' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('send-email handler error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function escHtml(str: unknown): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
