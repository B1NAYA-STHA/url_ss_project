const express = require("express");
const cors = require("cors");
const { chromium } = require("playwright");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

let browser;

// Launch browser once when server starts
(async () => {
  browser = await chromium.launch();
  console.log("Browser launched");
})();

app.post("/screenshot", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await page.close();

    const screenshotBase64 = screenshotBuffer.toString("base64");
    res.json({ screenshot: screenshotBase64 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to take screenshot" });
  }
});

process.on("exit", async () => {
  if (browser) await browser.close();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
