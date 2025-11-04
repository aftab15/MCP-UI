/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite/plugin";
import containerQueries from "@tailwindcss/container-queries";
import headlessui from "@headlessui/tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    colors: {
      "Persial-Blue": {
        50: "#E6F0F6",
        500: "#016DA6",
        600: "#016397",
        800: "#013C5B",
      },
      sky: { 700: "#016397", 600: "#016397" },
      "Fire-Opal": {
        50: "#FDEFED",
        400: "#EF8271",
        500: "#eb614b",
        600: "#e13419",
      },
      rose: {
        50: "#FDEFED",
      },
      slate: {
        200: "#E5E7EB",
      },
      orange: {
        700: "#D03801",
      },
      gray: {
        500: "#6B7280",
        100: "#F3F4F6",
        900: "#111928",
      },
      primary: {
        700: "#1A56DB",
        500: "#3F83F8",
      },
      AccordTitle: {
        700: "#111827",
      },
    },
    extend: {
      screens: {
        xs: "401px",
      },
      keyframes: {
        fadeInDelayed: {
          "0%": { opacity: "0", visibility: "hidden" },
          "1%": { visibility: "visible" },
          "100%": { opacity: "1", visibility: "visible" },
        },
      },
      animation: {
        "fade-in-delay": "fadeInDelayed 0.5s ease forwards",
      },
    },
  },
  plugins: [flowbite, containerQueries, headlessui],
};
