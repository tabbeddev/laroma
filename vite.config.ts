// @ts-ignore
import tailwindcss from "@tailwindcss/vite";
import deno from "@deno/vite-plugin";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [deno(), sveltekit(), tailwindcss()],
});
