import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { brand: "#2563a8", canvas: "#f5f5f2" } } },
  plugins: [],
} satisfies Config;
