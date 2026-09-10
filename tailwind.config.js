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

    // NOTE: keyframes/animation live under `extend` so Tailwind's built-ins
    // (animate-pulse, animate-spin, animate-bounce) survive. Declaring them at
    // theme level replaced the defaults, which silently disabled every
    // `animate-pulse` skeleton in the app.
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // Expanding ring behind the analysis loader's orb.
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.5' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        // Light sweep across the progress bar and placeholder blocks.
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        // Staggered dots in the active stage label.
        dot: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.35' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
      animation: {
        scroll: 'scroll 20s linear infinite',
        pulseRing: 'pulseRing 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 1.8s infinite',
        dot: 'dot 1.4s ease-in-out infinite',
      },
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
