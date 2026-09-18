// Loaded from loadDelayed(): third-party tags gated by scripts/site-config.js
// (all disabled by default until the site owner decides).

import config from './site-config.js';

function loadScript(src, attrs = {}) {
  const s = document.createElement('script');
  s.src = src;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.append(s);
  return s;
}

if (config.onetrust.enabled) {
  loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', { 'data-domain-script': config.onetrust.domainScript, 'data-document-language': 'true', charset: 'UTF-8' });
}
if (config.adobeLaunch.enabled) loadScript(config.adobeLaunch.src, { async: 'async' });
if (config.googleTags.enabled && config.googleTags.measurementId) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args) { window.dataLayer.push(args); };
  window.gtag('js', new Date());
  window.gtag('config', config.googleTags.measurementId);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${config.googleTags.measurementId}`, { async: 'async' });
}
if (config.gpt.enabled) loadScript('https://securepubads.g.doubleclick.net/tag/js/gpt.js', { async: 'async' });
