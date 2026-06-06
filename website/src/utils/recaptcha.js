const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

let scriptLoaded = false;

const loadScript = () =>
  new Promise((resolve) => {
    if (!SITE_KEY) return resolve(false);
    if (scriptLoaded && window.grecaptcha) return resolve(true);
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.onload = () => {
      scriptLoaded = true;
      resolve(true);
    };
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });

/**
 * Returns a reCAPTCHA v3 token, or '' when reCAPTCHA is not configured
 * (the backend treats a missing token as valid in that case).
 */
export const getRecaptchaToken = async (action = 'submit') => {
  if (!SITE_KEY) return '';
  const ok = await loadScript();
  if (!ok || !window.grecaptcha) return '';
  await new Promise((res) => window.grecaptcha.ready(res));
  return window.grecaptcha.execute(SITE_KEY, { action });
};
