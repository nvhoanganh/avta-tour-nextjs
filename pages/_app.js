import '../styles/index.css'
import '../styles/minimal.css'
import '../styles/spinner.css'
import "@fortawesome/fontawesome-free/css/all.min.css"
import Head from 'next/head';
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>
        AVTA - Australia Vietnamese Tennis Association
      </title>

      <Script src="/newrelic.js" />
      <Script src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js" />
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-KF25F4604L" async />
      <Script src="/ga.js" />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
