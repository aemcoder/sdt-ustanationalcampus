// Loaded from loadDelayed(): third-party tags, in the source site's order,
// gated by scripts/site-config.js.
import config from './site-config.js';

function loadScript(src, attrs = {}) {
  const s = document.createElement('script');
  s.src = src;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.append(s);
  return s;
}

// the source's Adobe data layer skeleton (digitalData) — Launch rules read it
const meta = (n) => document.querySelector(`meta[name="${n}"]`)?.content || '';
window.digitalData = window.digitalData || {
  version: '1.0',
  page: {
    attributes: {
      Title: document.title,
      pageTitle: document.querySelector('h1')?.textContent.trim() || document.title,
      resourceType: 'eds/page',
      pagePublishDate: meta('published-date'),
      pageDescription: meta('description'),
      pageTags: meta('category'),
      pageTemplate: meta('template') || 'default',
    },
  },
};
window.OptanonWrapper = window.OptanonWrapper || function OptanonWrapper() {};

if (config.onetrust.enabled) {
  loadScript(`https://cdn.cookielaw.org/consent/${config.onetrust.domainScript}/OtAutoBlock.js`);
  loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
    'data-domain-script': config.onetrust.domainScript,
    'data-document-language': 'true',
    charset: 'UTF-8',
  });
}
if (config.adobeLaunch.enabled) loadScript(config.adobeLaunch.src, { async: 'async' });
if (config.googleTags.enabled && config.googleTags.ids?.length) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args) { window.dataLayer.push(args); };
  window.gtag('js', new Date());
  config.googleTags.ids.forEach((id) => window.gtag('config', id));
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${config.googleTags.ids[0]}`, {
    async: 'async',
  });
}
if (config.facebookPixel.enabled && config.facebookPixel.id) {
  if (!window.fbq) {
    const n = function fbq(...args) {
      if (n.callMethod) n.callMethod(...args);
      else n.queue.push(args);
    };
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    window.fbq = n;
    // eslint-disable-next-line no-underscore-dangle
    window._fbq = n;
  }
  window.fbq('init', config.facebookPixel.id);
  window.fbq('track', 'PageView');
  loadScript('https://connect.facebook.net/en_US/fbevents.js', { async: 'async' });
}
if (config.gpt.enabled) {
  window.googletag = window.googletag || { cmd: [] };
  loadScript('https://securepubads.g.doubleclick.net/tag/js/gpt.js', { async: 'async' });
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableSingleRequest();
    window.googletag.setAdIframeTitle('Advertisement');
    window.googletag.enableServices();
  });
}
