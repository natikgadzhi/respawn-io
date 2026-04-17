module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-bg)",
        surface: "var(--color-surface)",
        rule: "var(--color-rule)",
        faint: "var(--color-faint)",
        muted: "var(--color-muted)",
        ink: "var(--color-ink)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        sans: ["var(--font-sans)"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--color-ink)",
            "--tw-prose-headings": "var(--color-ink)",
            "--tw-prose-lead": "var(--color-muted)",
            "--tw-prose-links": "var(--color-accent)",
            "--tw-prose-bold": "var(--color-ink)",
            "--tw-prose-counters": "var(--color-faint)",
            "--tw-prose-bullets": "var(--color-rule)",
            "--tw-prose-hr": "var(--color-rule)",
            "--tw-prose-quotes": "var(--color-muted)",
            "--tw-prose-quote-borders": "var(--color-accent)",
            "--tw-prose-captions": "var(--color-faint)",
            "--tw-prose-code": "var(--color-ink)",
            "--tw-prose-pre-code": "var(--color-ink)",
            "--tw-prose-pre-bg": "var(--color-surface)",
            "--tw-prose-th-borders": "var(--color-rule)",
            "--tw-prose-td-borders": "var(--color-rule)",
          },
        },
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
