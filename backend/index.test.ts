import request from "supertest";

// Mock playwright BEFORE loading the app
jest.mock("playwright");

import { app, initBrowser } from "./index";

beforeAll(async () => {
	await initBrowser(); // Initialize mocked browser
});

describe("POST /screenshot", () => {
	test("should return 400 if URL is missing", async () => {
		const res = await request(app).post("/screenshot").send({});
		expect(res.status).toBe(400);
		expect(res.body).toEqual({ error: "URL is required" });
	});

	test("should return base64 screenshot for valid URL", async () => {
		const res = await request(app)
			.post("/screenshot")
			.send({ url: "https://testing.com" });

		expect(res.status).toBe(200);
		expect(typeof res.body.screenshot).toBe("string");
		expect(res.body.screenshot.length).toBeGreaterThan(0);
	});
});
