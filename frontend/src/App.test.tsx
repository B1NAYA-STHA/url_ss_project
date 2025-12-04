import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import App from "./App";

globalThis.fetch = vi.fn();

describe("URL Screenshot App", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("renders input, button and heading", () => {
		render(<App />);
		expect(screen.getByText("URL Screenshot App")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter URL")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
	});

	test("updates input value when typed", () => {
		render(<App />);
		const input = screen.getByPlaceholderText("Enter URL") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "https://example.com" } });
		expect(input.value).toBe("https://example.com");
	});

	test("shows loading text when submitting", async () => {
		(fetch as vi.Mock).mockResolvedValueOnce({
			json: async () => ({ screenshot: "dummybase64string" }),
		});

		render(<App />);
		const input = screen.getByPlaceholderText("Enter URL") as HTMLInputElement;
		const button = screen.getByRole("button", { name: "OK" });

		fireEvent.change(input, { target: { value: "https://example.com" } });
		fireEvent.click(button);

		expect(screen.getByText("Taking screenshot...")).toBeInTheDocument();

		await waitFor(() => {
			expect(
				screen.queryByText("Taking screenshot..."),
			).not.toBeInTheDocument();
		});
	});

	test("displays screenshot image after successful fetch", async () => {
		(fetch as vi.Mock).mockResolvedValueOnce({
			json: async () => ({ screenshot: "dummybase64string" }),
		});

		render(<App />);
		const input = screen.getByPlaceholderText("Enter URL") as HTMLInputElement;
		const button = screen.getByRole("button", { name: "OK" });

		fireEvent.change(input, { target: { value: "https://example.com" } });
		fireEvent.click(button);

		const img = await screen.findByAltText("Screenshot");
		expect(img).toHaveAttribute(
			"src",
			"data:image/png;base64,dummybase64string",
		);
	});

	test("alerts on fetch error", async () => {
		(fetch as vi.Mock).mockRejectedValueOnce(new Error("Fetch failed"));
		window.alert = vi.fn();

		render(<App />);
		const input = screen.getByPlaceholderText("Enter URL") as HTMLInputElement;
		const button = screen.getByRole("button", { name: "OK" });

		fireEvent.change(input, { target: { value: "https://example.com" } });
		fireEvent.click(button);

		await waitFor(() => {
			expect(window.alert).toHaveBeenCalledWith("Failed to take screenshot");
		});
	});
});
