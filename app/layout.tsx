import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import "../styles/index.css";
import { config as blogConfig } from "../blog.config";

import Header from "components/header/header";
import Footer from "components/footer";

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  category: "technology",

  alternates: {
    canonical: blogConfig.baseURL,
    types: {
      'application/rss+xml': `${blogConfig.baseURL}'/rss/feed.xml`,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: blogConfig.title,
    url: blogConfig.baseURL
  },

  twitter: {
    creator: blogConfig.author.twitterHandle,
    site: blogConfig.author.twitterHandle,
    card: "summary_large_image"
  },

  themeColor: "#f0f9ff",
  manifest: "/site.webmanifest",

  verification: {
    other: {
      me: [blogConfig.author.fediverseURL]
    }
  }
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <Analytics />
      <body className="bg-blue-50 dark:bg-stone-950 text-stone950 dark:text-blue-50  ">
        <main className="min-h-screen max-w-3xl mx-auto">
          <div className="container mx-auto px-5">
            <Header />
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
