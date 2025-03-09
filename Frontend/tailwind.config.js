const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(), // Include Flowbite React content
  ],
  theme: {
    extend: {
      colors: {
        Navy: '#041E42',
        neutralGrey: '#4D4D4D',
        Homebg: '#CCCCFF',
        delft:'#1F305E',
        dolphins:'#008E97',
      },

      fontFamily:{
        itim:["Itim", "serif"],
        barlow:[ "Barlow", "serif"],
        dancing:["Dancing Script", "serif"],
      },
    },
  },
  plugins: [
    require("flowbite/plugin"), // Flowbite plugin
  ],
};
