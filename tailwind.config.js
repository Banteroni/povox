/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      "dark"
    ]
  },
  theme: {
  },
  plugins: [
    require("@tailwindcss/typography"), require('daisyui'),
  ],
}

