export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },

      colors: {
        fleet: {
          50: "#f0f4ff",
          100: "#e0eaff",
          200: "#c1d5ff",
          300: "#93b4ff",
          400: "#6090ff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#1e3066",
        },
      },

      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 16px 0 rgb(0 0 0 / 0.08)",
      },
    },
  },

  plugins: [],
};