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

    keyframes: {
      scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
      }
    },

    animation: {
      scroll: 'scroll 20s linear infinite',
    },

    fontFamily: {
      jost: ["Jost"],
      lato: ["Lato"],
      inter: ["Inter"],
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

      GREY: {
        _50: "#F9FAFB",
        _100: "#6B7280",
        _200: "#F2F4F7",
        _300: "#E6E6E6",
        _400: "#D0D5DD",
        _500: "#667085",
        _700: "#344054",
        _900: "#101828",
      },

      ORANGE: {
        _100: "#E57E46"
      },

      DARK: {
        _100: "#111827",
        _200: "#4B5563"
      },

      RED: {
        _100: "#AF202D",
      },
    },
  },
  plugins: [],
};
