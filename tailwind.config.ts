import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        bg: "var(--color-bg)",
        darkBg: "var(--color-dark-bg)",
        darkFg: "var(--color-dark-fg)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  darkMode: "class", // für ThemeToggle
  plugins: [],
};

export default config;