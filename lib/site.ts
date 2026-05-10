export const siteConfig = {
  name: "CinePersona",
  shortName: "CinePersona",
  description: "CinePersona Progressive Web App",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  themeColor: {
    light: "#ffffff",
    dark: "#000000",
  },
} as const;

export type SiteConfig = typeof siteConfig;
