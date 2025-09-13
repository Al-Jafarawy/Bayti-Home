module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        bounceSlow: 'bounceSlow 1.2s infinite',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
