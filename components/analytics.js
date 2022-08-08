import Script from 'next/script'

import { config } from '../blog.config'

export default function Analytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsPropertyID}`} strategy='afterInteractive' />
      <Script id='google-analytics' strategy='afterInteractive' >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${config.googleAnalyticsPropertyID}');
        `}
      </Script>
    </>
  )
}