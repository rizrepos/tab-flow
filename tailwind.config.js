/** @type {import('tailwindcss').Config} */
export default {
  content: ["./popup.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e8edf6",
          100: "#d1dbee",
          200: "#a3b7dd",
          300: "#7593cb",
          400: "#476fba",
          500: "#1a4b9a",
          600: "#153c7b",
          700: "#102d5c",
          800: "#0b1f3e",
          900: "#05101f",
          950: "#030a14",
        },
        surface: {
          0: "#ffffff",
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#d8dce5",
          300: "#b0b8c9",
          400: "#7a85a0",
          500: "#515d78",
          600: "#3d4760",
          700: "#2d3548",
          800: "#1c2233",
          900: "#111827",
          950: "#0a0e17",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease-out",
        "slide-up": "slideUp 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
