const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        tonehunt: {
          gray: {
            darker: "#101010",
            dark: "#141414",
            medium: "#222222",
            light: "#4b5563",
            lighter: "#909090",
            disable: "#5b5b5b",
          },
          yellow: "#C1BC7A",
          green: "#61C198",
          purple: "#9685ff",
          pink: "#BA7DC0",
          orange: "#C87967",
          blue: {
            dark: "#4000C7",
            medium: "#4E06E7",
            light: "#5ab0ff",
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
      textShadow: {
        bg: "-1px 1px 0 rgba(255,255,255,0.03), 1px 1px 0 rgba(255,255,255,0.03), 1px -1px 0 rgba(255,255,255,0.03), -1px -1px 0 rgba(255,255,255,0.03);",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    }),
  ],
};
