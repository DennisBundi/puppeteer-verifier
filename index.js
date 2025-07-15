const puppeteer = require("puppeteer");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/verify-link", async (req, res) => {
  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ error: "Missing link in request body." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(link, { waitUntil: "networkidle2" });

    console.log(`✅ Opened verification link: ${link}`);
    await browser.close();

    res.status(200).json({ success: true, message: "Verification link opened." });
  } catch (error) {
    console.error("❌ Error opening link:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
