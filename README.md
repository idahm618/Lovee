# Lovee

## Extractor API

This project includes an API endpoint to extract `.m3u8` links from any web page, including JavaScript-heavy dynamic sites.

### Usage

Send a GET request to:

```
/api/extractor?url=https://target-website.com
```

Returns JSON with the first `.m3u8` link and all found links.

### Local Development

```bash
npm install
npm run dev
```

Then visit:

```
http://localhost:3000/api/extractor?url=https://example.com
```

### Deployment

Deployed to Vercel or any platform supporting Node.js serverless functions.

---

**Note:** Puppeteer is required and already included in `package.json`.
