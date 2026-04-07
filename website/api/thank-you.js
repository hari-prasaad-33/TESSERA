const { sendBelieverThankYou, isValidEmail } = require('./lib/sendBelieverThankYou');

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
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

  const email = body?.email;
  if (!isValidEmail(email)) {
    return json(res, 400, { ok: false, error: 'Invalid email' });
  }

  const result = await sendBelieverThankYou(email);
  if (!result.ok) {
    const status = result.error === 'Missing RESEND_API_KEY' ? 500 : result.error === 'Invalid email' ? 400 : 502;
    return json(res, status, {
      ok: false,
      error: result.error,
      ...(result.detail ? { detail: result.detail } : {}),
    });
  }

  return json(res, 200, { ok: true });
};
