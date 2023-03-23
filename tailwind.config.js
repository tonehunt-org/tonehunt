/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        tonestack: {
          gray: {
            dark: "#141414",
            medium: "#222222",
            light: "#4b5563",
            lighter: "#909090",
            disable: "#5b5b5b",
          },
          yellow: "#C1BC7A",
          green: "#61C198",
          purple: "#BA7DC0",
          orange: "#C87967",
          blue: {
            dark: "#4000C7",
            medium: "#4E06E7",
          },
        },
      },
      fontFamily: {
        "satoshi-light": "Satoshi-Light",
        "satoshi-regular": "Satoshi-Regular",
        "satoshi-medium": "Satoshi-Medium",
        "satoshi-bold": "Satoshi-Bold",
      },
      fontSize: {
        tiny: ".625rem",
      },
    },
  },
  plugins: [],
};
