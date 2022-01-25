import '../styles/index.css'
import '../styles/minimal.css'
import '../styles/spinner.css'
import "@fortawesome/fontawesome-free/css/all.min.css"
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>
        AVTA - Australia Vietnamese Tennis Association
      </title>
      <script type="text/javascript" src="/newrelic.js">
      </script>
      <script src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pace-js@latest/pace-theme-default.min.css"></link>
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
