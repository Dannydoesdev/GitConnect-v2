/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  mode: 'jit',
  // content: ['./src/**/*.tsx'],
  // content: ['./**/*.tsx'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
 
    // "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",

  // purge: [
  //   // './src/**/*.tsx',
  //   './public/**/*.html',
  //   './src/**/*.{js,jsx,ts,tsx,vue}'
  // ],
  theme: {
    extend: {
      colors: {
        electric: '#db00ff',
        ribbon: '#0047ff',
      },
    },
  },
  // plugins: [],
  plugins: [require("@tailwindcss/typography")],
}
