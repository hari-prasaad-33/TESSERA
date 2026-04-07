function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  if (email.length < 6 || email.length > 254) return false;
  // Pragmatic validation; avoid rejecting legitimate addresses.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderEmailHtml() {
  const bg = '#0e0c09';
  const text = '#f0ebe0';
  const muted = '#c6cfdd';
  const teal = '#5dd4f0';
  const amber = '#ffb84d';

  const site = 'https://tesseraaudio.com';
  const believe = 'https://tesseraaudio.com/believe';

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${bg};color:${text};font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:28px 18px 34px;">
      <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;background:rgba(8,10,16,0.55);padding:22px 18px;">
        <p style="margin:0 0 14px;font-size:18px;line-height:1.45;">
          <strong style="color:${amber};">Thank you for believing in us.</strong>
        </p>

        <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${muted};">
          You just joined a small but growing group of people who think the creative act is worth protecting. That means more to us than you know.
        </p>

        <p style="margin:0 0 10px;font-size:15px;line-height:1.65;color:${muted};">
          Here&apos;s what we believe:
        </p>

        <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${muted};">
          The hours you spend shaping a sound — that is not friction to be removed. That is the work itself. AI should remove the tedious parts, not the meaningful ones.
          The machine can suggest. The artist still decides.
        </p>

        <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${muted};">
          That&apos;s what we&apos;re building at Tessera. The first product, Tessera EQ, is being built in the open — and you&apos;ll be among the first to know when it&apos;s ready.
        </p>

        <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${muted};">
          Until then, if you haven&apos;t already, take a look around:
          <a href="${site}" style="color:${teal};text-decoration:underline;">${escapeHtml(site)}</a>
        </p>

        <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:${muted};">
          And if you know someone who cares about this as much as you do, send them our way:
          <a href="${believe}" style="color:${teal};text-decoration:underline;">${escapeHtml(believe)}</a>
        </p>

        <p style="margin:0;font-size:15px;line-height:1.65;color:${muted};">
          We&apos;ll be in touch.
        </p>

        <div style="margin:16px 0 0;font-size:14px;line-height:1.55;color:${muted};">
          <div style="font-weight:700;color:${text};">Hari</div>
          <div>Founder &amp; CEO, TESSERA</div>
          <div>7305205794</div>
          <div>
            <a href="${site}" style="color:${teal};text-decoration:underline;">tesseraaudio.com</a>
          </div>
        </div>
      </div>

      <p style="margin:12px 4px 0;font-size:12px;line-height:1.5;color:rgba(198,207,221,0.72);">
        You&apos;re receiving this because you signed up at <a href="${site}" style="color:${teal};text-decoration:none;">tesseraaudio.com</a>.
      </p>
    </div>
  </body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json(res, 500, { ok: false, error: 'Missing RESEND_API_KEY' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return json(res, 400, { ok: false, error: 'Invalid JSON' });
  }

  const email = body?.email;
  if (!isValidEmail(email)) {
    return json(res, 400, { ok: false, error: 'Invalid email' });
  }

  // Prefer a verified domain once configured in Resend.
  const from = process.env.RESEND_FROM || 'Tessera Audio <onboarding@resend.dev>';
  const subject = "You're in. Welcome to Tessera.";

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email.trim()],
        subject,
        html: renderEmailHtml(),
      }),
    });

    if (!resendRes.ok) {
      const text = await resendRes.text().catch(() => '');
      return json(res, 502, { ok: false, error: 'Resend error', detail: text.slice(0, 500) });
    }

    return json(res, 200, { ok: true });
  } catch (err) {
    return json(res, 500, { ok: false, error: 'Unexpected error' });
  }
};
