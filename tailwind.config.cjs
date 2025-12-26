module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      typography: {
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
          },
        },
      },
      letterSpacing: {
        tighter: "-.04em",
      },
      lineHeight: {
        tight: 1.2,
        relaxed: 1.7,
      },
      fontWeight: {
        chonkymedium: 500,
      },
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
      },
      boxShadow: {
        sm: "0 3px 6px rgba(0, 0, 0, 0.075)",
      },
    },
  },
};
