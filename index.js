const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/verify-link', async (req, res) => {
  const { link } = req.body;
  console.log("📩 Incoming link:", link);

  if (!link) {
    return res.status(400).json({ error: "Missing link in request body." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // OPTIONAL: Set user agent to avoid bot detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    );

    console.log("🚀 Opening link in headless browser...");
    await page.goto(link, {
      waitUntil: 'networkidle2',
      timeout: 15000 // 15 seconds timeout
    });

    console.log(`✅ Opened verification link: ${link}`);
    await browser.close();

    res.status(200).json({
      success: true,
      message: "Verification link opened."
    });

  } catch (error) {
    console.error("❌ Error opening link:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


