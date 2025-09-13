module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounceSlow: {
          "0%, 100%": { transform: "translateY(-1px)" },
          "50%": { transform: "translateY(4px)" },
        },
      },
      animation: {
        bounceSlow: "bounceSlow 1.7s infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
