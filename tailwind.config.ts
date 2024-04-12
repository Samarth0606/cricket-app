import type { Config } from "tailwindcss";

import defaultTheme from "tailwindcss/defaultTheme.js";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "pink-1": "var(--pink-1)",
        "pink-2": "var(--pink-2)",
        "pink-3": "var(--pink-3)",
        "purple-1": "var(--purple-1)",
        "purple-2": "var(--purple-2)",
        "gray-1": "var(--gray-1)",
        "gray-2": "var(--gray-2)",
        "gray-3": "var(--gray-3)",
        "yellow-1": "var(--yellow-1)",
        "yellow-2": "var(--yellow-2)",
        "yellow-3": "var(--yellow-3)",
        "red-1": "var(--red-1)",
        "red-2": "var(--red-2)",
        "red-3": "var(--red-3)",
        fader: "var(--fader)",
      },
      fontFamily: {
        cwc: ["CWC", ...defaultTheme.fontFamily.sans],
        "cwc-india": ["CWC-India", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "top-jhaalar": "var(--top-jhaalar)",
        "left-jhaalar": "var(--left-jhaalar)",
        "left-jhaalar-purple": "var(--left-jhaalar-blue)",
        "right-jhaalar": "var(--right-jhaalar)",
        "right-jhaalar-purple": "var(--right-jhaalar-blue)",
        "bottom-right-corner": "var(--bottom-right-corner)",
        "bottom-left-corner": "var(--bottom-left-corner)",
      },
      backgroundSize: {
        "2": "1.2rem",
        "10": "10rem",
      },
    },
  },
  plugins: [require("tailwind-clip-path")],
} satisfies Config;
