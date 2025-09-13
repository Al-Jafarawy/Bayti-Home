module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slidePulse: {
          "0%, 60%, 100%": { transform: "scale(0.6)" },
          "30%": { transform: "scale(1.5)" },
        },
      },
      animation: {
        slidePulse: "slidePulse 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
