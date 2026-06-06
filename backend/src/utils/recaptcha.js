/**
 * Verify a Google reCAPTCHA v3 token.
 * No-op (returns true) when RECAPTCHA_SECRET is not configured, so the
 * project works out-of-the-box in development.
 */
const verifyRecaptcha = async (token, remoteIp) => {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return true; // disabled in dev / not configured
  if (!token) return false;

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp) params.append('remoteip', remoteIp);

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await res.json();
    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5');
    return data.success === true && (data.score === undefined || data.score >= minScore);
  } catch (err) {
    console.error('reCAPTCHA verification failed', err.message);
    return false;
  }
};

module.exports = { verifyRecaptcha };
