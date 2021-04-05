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
        primary: "#2a4365",
        dimmed: {
          "text-primary": "#adbac7",
          "text-secondary": "#768390",
          "text-tertiary": "#768390",
          "text-link": "#539bf5",
          "header-text": "rgba(205,217,229,0.7)",
          "bg-canvas": "#22272e",
          "bg-canvas-mobile": "#1c2128",
          "bg-canvas-inverse": "#cdd9e5",
          "bg-canvas-inset": "#1e2228",
          "bg-primary": "#22272e",
          "bg-secondary": "#22272e",
          "bg-tertiary": "#2d333b",
          "bg-overlay": "#373e47",
          "header-bg": "#2d333b",
          "border-primary": "#444c56",
          "border-secondary": "#373e47",
          "border-tertiary": "#636e7b",
          "border-overlay": "#444c56",
          "border-inverse": "#cdd9e5"
        }
      },
      fontSize: {
        "7xl": "5rem",
        "8xl": "6rem",
        "9xl": "7rem",
        "10xl": "8rem"
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        "15px": "0.9375rem",
        "23px": "1.4375rem",
        full: "100%"
      },
      width: {
        xl: "36rem"
      },
      maxWidth: {
        "4.5xl": "60rem",
        "8xl": "90rem"
      }
    }
  },
  variants: {},
  plugins: [require("@tailwindcss/ui")]
};
