import { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { Analytics } from "@vercel/analytics/react";

import "../styles/index.css";
import { config as blogConfig } from "../blog.config";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'en_US',
            url: blogConfig.baseURL,
            siteName: blogConfig.title,
          }}
          twitter={{
            handle: blogConfig.author.twitterHandle,
            site: blogConfig.author.twitterHandle,
            cardType: 'summary_large_image',
          }}
        />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}

export default App;
