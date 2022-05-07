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
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
