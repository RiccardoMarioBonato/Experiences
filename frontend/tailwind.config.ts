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
        neon: {
          purple: "#E040FB",
          pink: "#F50057",
        },
        surface: "#13111A",
        "bg-dark": "#0D0D0F",
      },
    },
  },
  plugins: [],
};
export default config;
