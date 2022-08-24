/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://respawn.io",
  generateRobotsTxt: true,
  generateIndexSitemap: false
};
