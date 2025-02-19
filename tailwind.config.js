/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.html", "./src/**/*.jsx", "./src/**/*.js"],
  theme: {
    screens: {
      xs: "300px", //360px
      sm: "640px",
      md: "768px",
      lm: "1024px",
      lg: "1280px",
      xl: "1536px",
    },

    fontFamily: {
      nunito: ["Nunito Sans"],
      inter: ["Inter"],
      hanken: ["Hanken Grotesk"],
    },
    colors: {
      primary: "#3BFF81",

      secondary: "",

      tertiary: "",

      white: "#fff",
      black: "#000",

      MODAL_BACKGROUND: "rgba(11, 12, 14, 0.77)",

      GREEN: {
        _100: "#42D979",
        _200: "#6C8173",
      },

      RED: {
        _100: "#AF202D",
      },
    },
  },
  plugins: [],
};
