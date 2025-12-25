// These are some config settings used across the markup and website.

export const config = {
  title: "Natik's Journal",
  description: "Notes on engineering leadership and software development.",
  // Canonical URL for SEO - always respawn.io
  baseURL: "https://respawn.io",
  // Public serving URL - set via SITE_URL env var at container runtime
  // Falls back to baseURL if not set
  get siteURL() {
    return process.env.SITE_URL || this.baseURL;
  },
  githubURL: "https://github.com/natikgadzhi/respawn-io",

  meta: {
    title: "Natik's Journal: Blog on engineering management",
    description: "Notes on engineering leadership and software development.",
  },

  author: {
    name: "Natik Gadzhi",
    email: "nate@respawn.io",
    twitterURL: "https://twitter.com/natikgadzhi",
    twitterHandle: "@natikgadzhi",
    fediverseURL: "https://hachyderm.io/@natik",
    github: "https://github.com/natikgadzhi",
  },

  daily: {
    title: "Daily",
    description:
      "Quick notes on things I learned that day. Mostly coding, and some a-ha moment in working with people, or tricks to get projects done on time.",
  },

  footer: {
    copyright: "© Natik Gadzhi",
  },

  counterscale: {
    siteId: "respawn-io",
    url: "https://1ca90c7a.counterscale-a1l.pages.dev",
  },
};
