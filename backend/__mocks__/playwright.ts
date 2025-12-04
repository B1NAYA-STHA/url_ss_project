export const chromium = {
	launch: async () => ({
		newPage: async () => ({
			goto: async () => {},
			screenshot: async () => Buffer.from("mock_screenshot"),
			close: async () => {},
		}),
		close: async () => {},
	}),
};
