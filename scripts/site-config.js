/**
 * Owner-facing third-party integrations for the USTA National Campus site.
 * Every tag is DISABLED until the site owner confirms which run on the new host
 * (stardust/dynamic-features.md rows 15–18: GPT ads, OneTrust CMP, Adobe Launch,
 * Google tags). Flip `enabled` and fill the ids; scripts/delayed.js loads only
 * the enabled entries after consent.
 */
export default {
  onetrust: { enabled: false, domainScript: '0559fedb-5557-478a-9365-fb08f652f6a4' },
  adobeLaunch: { enabled: false, src: 'https://assets.adobedtm.com/launch-EN1e11bbf3860f415da9319a506515ad69.min.js' },
  googleTags: { enabled: false, measurementId: '' },
  gpt: { enabled: false, adUnits: { ros: 'div-gpt-ad-1789745137559' } },
  courtReserve: { bookNow: 'https://usta.courtreserve.com/Online/Events/List/6415/F6SUBQ2NFZ6415' },
  data: { events: '/data/events.json', newsfeed: '/data/newsfeed.json', photogallery: '/data/photogallery-collegiate.json' },
};
