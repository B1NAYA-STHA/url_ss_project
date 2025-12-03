import cors from "cors";
import express, { type Request, type Response } from "express";
import { type Browser, chromium } from "playwright";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

let browser: Browser;

// Launch browser once when server starts
(async () => {
	try {
		browser = await chromium.launch();
		console.log("Browser launched");
	} catch (error) {
		console.error("Failed to launch browser:", error);
	}
})();

app.post("/screenshot", async (req: Request, res: Response) => {
	const { url }: { url?: string } = req.body;

	if (!url) return res.status(400).json({ error: "URL is required" });

	try {
		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "networkidle" });

		const screenshotBuffer = await page.screenshot({ fullPage: true });
		await page.close();

		const screenshotBase64 = screenshotBuffer.toString("base64");
		res.json({ screenshot: screenshotBase64 });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Failed to take screenshot" });
	}
});

// shutdown
process.on("exit", async () => {
	if (browser) await browser.close();
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
