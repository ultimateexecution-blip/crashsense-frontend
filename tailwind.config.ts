import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#0f3d5e", light: "#1d5a85" },
        minor: "#2c7a4b", moderate: "#d98a12", critical: "#c8312b",
      },
    },
  },
  plugins: [],
};
export default config;
