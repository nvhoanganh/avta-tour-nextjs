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
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
