import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing ?url=" });

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0");

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Search in both DOM and JS variables
    const m3u8Links = await page.evaluate(() => {
      // 1. From DOM (HTML - src attributes, inline JS, etc)
      const html = document.documentElement.innerHTML;
      const regex = /(https?:\/\/[^\s"'>]+\.m3u8[^\s"'>]*)/g;
      const domMatches = html.match(regex) || [];

      // 2. From JS variables (window, script tags, etc)
      const scriptLinks = [];
      const scripts = Array.from(document.getElementsByTagName("script"));
      scripts.forEach(script => {
        const text = script.innerText || script.textContent || "";
        const matches = text.match(regex);
        if (matches) scriptLinks.push(...matches);
      });

      // Combine and deduplicate
      return Array.from(new Set([...domMatches, ...scriptLinks]));
    });

    await browser.close();

    if (m3u8Links.length > 0) {
      return res.json({ m3u8: m3u8Links[0], all: m3u8Links });
    } else {
      return res.json({ error: "No .m3u8 found" });
    }
  } catch (err) {
    if (browser) await browser.close();
    return res.status(500).json({ error: err.message });
  }
}
