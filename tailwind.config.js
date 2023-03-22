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
        "satoshi-variable": "Satoshi-Variable",
        "satoshi-variable-italic": "Satoshi-VariableItalic",
        "satoshi-light": "Satoshi-Light",
        "satoshi-light-italic": "Satoshi-LightItalic",
        "satoshi-regular": "Satoshi-Regular",
        "satoshi-italic": "Satoshi-Italic",
        "satoshi-medium": "Satoshi-Medium",
        "satoshi-medium-italic": "Satoshi-MediumItalic",
        "satoshi-bold": "Satoshi-Bold",
        "satoshi-bold-italic": "Satoshi-BoldItalic",
        "satoshi-black": "Satoshi-Black",
        "satoshi-black-italic": "Satoshi-BlackItalic",
      },
      fontSize: {
        tiny: ".625rem",
      },
    },
  },
  plugins: [],
};
