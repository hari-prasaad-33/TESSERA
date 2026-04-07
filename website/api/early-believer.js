function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const e = value.trim();
  if (e.length < 6 || e.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/** Optional: set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to dedupe by email across devices. */
async function redisCmd(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return undefined;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data === 'string' ? data : data.error || 'Redis request failed');
  }
  return data.result;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return json(res, 400, { ok: false, error: 'Invalid JSON' });
  }

  const emailRaw = body?.email;
  if (!isValidEmail(emailRaw)) {
    return json(res, 400, { ok: false, error: 'Invalid email' });
  }

  const email = emailRaw.trim();
  const normalized = email.toLowerCase();
  const formId = process.env.FORMSPREE_FORM_ID || 'mbdpqojl';

  try {
    let already = false;
    try {
      const member = await redisCmd(['SISMEMBER', 'tessera:believers', normalized]);
      if (member === 1 || member === true) already = true;
    } catch {
      /* Redis misconfigured — continue without dedupe */
    }

    if (already) {
      return json(res, 200, { ok: true, alreadySignedUp: true });
    }

    const fd = new FormData();
    fd.append('email', email);
    const msg = body?.message != null ? String(body.message).trim() : '';
    if (msg) fd.append('message', msg);

    const formRes = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' },
    });

    if (!formRes.ok) {
      const detail = await formRes.text().catch(() => '');
      return json(res, 502, { ok: false, error: 'Form submit failed', detail: detail.slice(0, 400) });
    }

    try {
      const url = process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;
      if (url && token) {
        await redisCmd(['SADD', 'tessera:believers', normalized]);
      }
    } catch {
      /* list update failed — Formspree still has the row */
    }

    const vercelHost = process.env.VERCEL_URL;
    if (vercelHost) {
      await fetch(`https://${vercelHost}/api/thank-you`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => {});
    }

    return json(res, 200, { ok: true });
  } catch (e) {
    return json(res, 500, { ok: false, error: 'Unexpected error' });
  }
};
