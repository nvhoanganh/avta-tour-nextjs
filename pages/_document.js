import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pace-js@latest/pace-theme-default.min.css"></link>
          <script type="text/javascript" src="/newrelic.js" async />
          <script type="text/javascript" src="/gtm.js" async />
          <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js" async />
          <script type="text/javascript" src="/clarity.js" async />
        </Head>
        <body>
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PMT2XNM"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
          <div id="fb-root"></div>
          <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v13.0&appId=955095205088132&autoLogAppEvents=1" nonce="AcLzT9WI"></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
