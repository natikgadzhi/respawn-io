import { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";
import * as Fathom from "fathom-client";

import "../styles/index.css";
import { config as blogConfig } from "../blog.config";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Initialize Fathom when the app loads
    Fathom.load(blogConfig.fathom.propertyID, {
      includedDomains: [blogConfig.fathom.domain],
      url: blogConfig.fathom.scriptURL,
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  });

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
    </>
  )
}

export default App;
