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

    console.log("🚀 Opening link in headless browser...");
    await page.goto(link, { waitUntil: 'networkidle2', timeout: 15000 }); // add timeout

    console.log(`✅ Opened verification link: ${link}`);
    await browser.close();

    res.status(200).json({ success: true, message: "Verification link opened." });
  } catch (error) {
    console.error("❌ Error opening link:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


