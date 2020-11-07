const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: {
    content: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.jsx"]
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito Sans", "sans-serif", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: "#2a4365"
      },
      fontSize: {
        "7xl": "5rem",
        "8xl": "6rem",
        "9xl": "7rem",
        "10xl": "8rem"
      }
    }
  },
  variants: {},
  plugins: [require("@tailwindcss/ui")]
};
