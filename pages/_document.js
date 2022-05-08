import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pace-js@latest/pace-theme-default.min.css"></link>
          <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet"></link>
          <script type="text/javascript" src="/newrelic.js" async />
          <script type="text/javascript" src="/ga.js" async />
          <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js" async />
          <script type="text/javascript" src="https://www.googletagmanager.com/gtag/js?id=G-KF25F4604L" async />
        </Head>
        <body>
          <div id="fb-root"></div>
          <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v13.0&appId=955095205088132&autoLogAppEvents=1" nonce="AcLzT9WI"></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
