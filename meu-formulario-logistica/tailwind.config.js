/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Isso diz: estilize todos os arquivos JS/JSX na pasta src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}