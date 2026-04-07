/**
 * Shared Resend send for Early Believers thank-you email.
 * Used by /api/thank-you and /api/early-believer (direct call avoids flaky self-fetch on Vercel).
 */

function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  if (email.length < 6 || email.length > 254) return false;
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
  /* Section 03: quarry-04-puresky + darker tint (see App.jsx + index.css glass-pane) */
  const fallbackBg = '#080b12';
  const text = '#f0ebe0';
  const muted = '#c6cfdd';
  const teal = '#5dd4f0';
  const amber = '#ffb84d';

  const site = 'https://tesseraaudio.com';
  const believe = 'https://tesseraaudio.com/believe';
  const textureUrl = `${site}/images/textures/quarry-04-puresky.jpg`;
  /* Darker than before: vertical scrim + left-weighted midnight (matches “dark left” on site) */
  const bgLayers = `linear-gradient(90deg,rgba(3,6,12,0.72) 0%,rgba(5,9,16,0.38) 42%,rgba(6,10,18,0.2) 100%),linear-gradient(180deg,rgba(4,8,16,0.62),rgba(5,10,18,0.52) 45%,rgba(3,6,12,0.68)),url(${textureUrl})`;
  const bgSizes = 'cover,cover,cover';
  const bgPositions = 'left center, center top, center top';

  /* approx .glass-pane: light top edge, inset highlight, blur where supported (often stripped in webmail) */
  const glassCard = [
    'border-radius:20px',
    'border:1px solid rgba(255,255,255,0.12)',
    'background-color:rgba(5,7,12,0.72)',
    'background-image:linear-gradient(165deg,rgba(255,255,255,0.1) 0%,rgba(255,255,255,0.03) 38%,rgba(6,9,16,0.55) 100%)',
    'box-shadow:0 12px 48px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.14),inset 0 -1px 0 rgba(0,0,0,0.35)',
    '-webkit-backdrop-filter:blur(22px) saturate(1.12)',
    'backdrop-filter:blur(22px) saturate(1.12)',
    'padding:22px 18px',
  ].join(';');

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:${fallbackBg};color:${text};font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${fallbackBg};background-image:${bgLayers};background-size:${bgSizes};background-position:${bgPositions};background-repeat:no-repeat,no-repeat,no-repeat;">
      <tr>
        <td align="center" style="padding:28px 18px 34px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;">
            <tr>
              <td>
      <div style="${glassCard}">
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
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * @param {string} email
 * @returns {Promise<{ ok: true } | { ok: false; error: string; detail?: string }>}
 */
async function sendBelieverThankYou(email) {
  if (!isValidEmail(email)) {
    return { ok: false, error: 'Invalid email' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'Missing RESEND_API_KEY' };
  }

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
      return { ok: false, error: 'Resend error', detail: text.slice(0, 500) };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'Unexpected error' };
  }
}

module.exports = { sendBelieverThankYou, isValidEmail };
