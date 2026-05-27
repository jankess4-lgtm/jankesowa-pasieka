import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#166534",
          greenDark: "#14532d",
          brown: "#92400E",
          brownDark: "#78350f",
          cream: "#F5EDE4",
          creamDark: "#EDE0D0",
          gold: "#D97706",
          goldDark: "#B45309",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
