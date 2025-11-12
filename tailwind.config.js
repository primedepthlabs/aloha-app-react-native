/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  // include the NativeWind preset so Tailwind works with RN
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
