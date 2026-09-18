> **Resolved 2026-09-18:** `helix-query.yaml` at the repo root IS honoured by this site (bulk reindex `POST /index/…/main/*` processed 946 pages). The news index has its own target `/news/query-index.json` — two indices sharing one target file collided (the later one overwrote the default rows).

# Query index configuration (org admin, tools.aem.live)

`helix-query.yaml` is retired for this org (AGENTS.md); the index lives in the config service. The `news-listing`
block and the header breadcrumb read `/query-index.json`. Configure for `aemcoder / sdt-ustanationalcampus`:

| sheet | include | exclude | columns |
|---|---|---|---|
| `default` (query-index.json) | `/**` | `/nav`, `/footer`, `/fragments/**`, `/drafts/**` | `path`, `title`, `description`, `image`, `template`, `lastModified` |
| `news` | `/news/**` | `/news/holiday-hours` | `path`, `title`, `description`, `image`, `published-date` (meta `published-date`), `category` (meta `category`), `kicker` (meta `kicker`), `author` (meta `author`) |

Equivalent legacy `helix-query.yaml` for reference:

```yaml
version: 1
indices:
  default:
    include: ['/**']
    exclude: ['/nav', '/footer', '/fragments/**', '/drafts/**']
    target: /query-index.json
    properties:
      title: { select: 'head > meta[property="og:title"]', value: attribute(el, 'content') }
      description: { select: 'head > meta[name="description"]', value: attribute(el, 'content') }
      image: { select: 'head > meta[property="og:image"]', value: match(attribute(el, 'content'), 'https:\/\/[^/]+(\/.*)') }
      template: { select: 'head > meta[name="template"]', value: attribute(el, 'content') }
      lastModified: { select: none, value: parseTimestamp(headers['last-modified'], 'ddd, DD MMM YYYY hh:mm:ss GMT') }
  news:
    include: ['/news/**']
    exclude: ['/news/holiday-hours']
    target: /query-index.json
    properties:
      title: { select: 'head > meta[property="og:title"]', value: attribute(el, 'content') }
      description: { select: 'head > meta[name="description"]', value: attribute(el, 'content') }
      image: { select: 'head > meta[property="og:image"]', value: match(attribute(el, 'content'), 'https:\/\/[^/]+(\/.*)') }
      published-date: { select: 'head > meta[name="published-date"]', value: attribute(el, 'content') }
      category: { select: 'head > meta[name="category"]', value: attribute(el, 'content') }
      kicker: { select: 'head > meta[name="kicker"]', value: attribute(el, 'content') }
      author: { select: 'head > meta[name="author"]', value: attribute(el, 'content') }
```

Until the index exists, `news-listing` falls back to `/data/newsfeed.json` (909 items) and the breadcrumb to path segments + the page `<h1>`.
