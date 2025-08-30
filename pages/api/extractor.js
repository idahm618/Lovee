// pages/api/extractor.js
import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing ?url=" });

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const regex = /(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/g;
    const matches = data.match(regex);

    if (matches && matches.length > 0) {
      return res.json({ m3u8: matches[0], all: matches });
    } else {
      return res.json({ error: "No .m3u8 found" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
