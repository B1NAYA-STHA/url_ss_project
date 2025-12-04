import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfigExport } from "vite";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
	},
} as UserConfigExport);
