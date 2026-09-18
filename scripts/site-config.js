/**
 * Third-party integrations ported from the source site (owner decision 2026-09-18: port all
 * tags).
 * Ids lifted from the captured source pages (stardust/current/pages/en-home-html.html).
 * scripts/delayed.js loads them in the source's order: OneTrust (auto-block + stub) first, then
 * Adobe Launch, Google tags, the Facebook pixel and GPT. Flip `enabled` to switch a tag off.
 */
export default {
  onetrust: { enabled: true, domainScript: '0559fedb-5557-478a-9365-fb08f652f6a4' },
  adobeLaunch: {
    enabled: true,
    src: 'https://assets.adobedtm.com/launch-EN1e11bbf3860f415da9319a506515ad69.min.js',
  },
  googleTags: { enabled: true, ids: ['G-S2332WYSW3', 'G-0MS4BSS9YJ', 'AW-11095761697'] },
  facebookPixel: { enabled: true, id: '3642094592776600' },
  gpt: {
    enabled: true, adUnit: '/5681/National_Campus', sizes: [[320, 50], [728, 90]], sizeMapping: [[[1024, 1], [728, 90]], [[100, 1], [320, 50]]],
  },
  courtReserve: { bookNow: 'https://usta.courtreserve.com/Online/Events/List/6415/F6SUBQ2NFZ6415' },
  data: {
    events: '/data/events.json',
    newsfeed: '/data/newsfeed.json',
    photogallery: '/data/photogallery-collegiate.json',
  },
};
