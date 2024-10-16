import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../../components/layout';
import PostTitle from '../../../components/post-title';
import ToggleContactDetails from '../../../components/ToggleContactDetails';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import { useEffect, useState } from 'react'
import { getAllCompetitionsForHome, getCompetitionBySlug } from '../../../lib/api';


export default function Apply({ competition, allPlayers, preview }) {
  const router = useRouter();
  const [applicationState, setApplicationState] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentErrorDetails, setPaymentErrorDetails] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(async () => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setChecking(true);
      const session_id = query.get('session_id');
      const applicationId = query.get('applicationId');
      return fetch(`/api/get_session?session_id=${query.get('session_id')}&competition=${competition.slug}`)
        .then(response => response.json())
        .then((rsp) => {
          setChecking(false);
          if (rsp.success) {
            setApplicationState({
              applicationId,
              ...rsp
            })
          }
        }).catch((err) => {
          if (window.newrelic) {
            window.newrelic.noticeError(err, { session_id, applicationId });
          }
          setChecking(false);
          setPaymentErrorDetails(err.toString());
          setPaymentError('Oops! Something went wrong. Please try again');
        });
    }

    if (query.get('canceled')) {
      setPaymentError(`It looks like you click Cancelled on Stripe checkout page. You can also use PayID to pay for the application fee`);
    }
  }, []);


  return (
    <Layout preview={false}>
      <Navbar transparent />

      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <article>
            <Head>
              <title>Apply - {competition.title} - Max {competition.maxPoint}{' '}
                Point | AVTA.</title>
            </Head>
          </article>

          <main className='profile-page'>
            <section className='relative block h-500-px'>
              <div
                className='absolute top-0 w-full h-full bg-center bg-cover'
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
                }}
              >
                <span
                  id='blackOverlay'
                  className='w-full h-full absolute opacity-50 bg-black'
                ></span>
              </div>
              <div
                className='top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px'
                style={{ transform: 'translateZ(0)' }}
              >
                <svg
                  className='absolute bottom-0 overflow-hidden'
                  xmlns='http://www.w3.org/2000/svg'
                  preserveAspectRatio='none'
                  version='1.1'
                  viewBox='0 0 2560 100'
                  x='0'
                  y='0'
                >
                  <polygon
                    className='text-gray-200 fill-current'
                    points='2560 0 2560 100 0 100'
                  ></polygon>
                </svg>
              </div>
            </section>

            <section className='relative py-16 bg-gray-200'>
              <div className='container mx-auto px-4'>
                <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64'>
                  <div className='px-6'>
                    <div className='flex flex-wrap justify-center'>
                      <div className='w-full lg:w-3/12 px-4 lg:order-2 flex justify-center'>
                        <div className='relative'>
                          <div className='rounded-full shadow-xl text-green-900 bg-gray-100 h-auto align-middle border border-gray-300 absolute -m-20 -ml-20 lg:-ml-16 max-w-300-px text-4xl p-6 text-center'>
                            <i className='fas fa-trophy text-6xl text-yellow-400'></i>
                            {
                              competition.maxPoint
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='mt-24'>
                      {
                        checking && <div className='mb-8 text-center'>
                          <p className="uppercase py-2 h1">Processing...</p>
                          <p className="text-gray-400 pb-6">Please wait while we process your payment...</p>
                        </div>
                      }

                      {
                        applicationState && <div className='mb-8 text-center'>
                          <p className="uppercase py-2 h1">Payment Received</p>
                          <p className="text-gray-400 text-sm pb-6">Thanks {applicationState?.customer?.name}!</p>
                          <p className="text-gray-400 text-sm pb-6">We have received ${applicationState.amount_total / 100}.00 for your application</p>
                          <p className="text-gray-400 text-sm pb-6">Ref Id: {applicationState?.applicationId}</p>

                          <Link href={`/competitions/${competition.slug}`}>
                            <a
                              className='bg-blue-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 w-full sm:w-32 text-center mb-8'
                            >
                              Go Back to Competition
                            </a></Link>
                        </div>
                      }

                      {
                        paymentError && <div className='mb-8 text-center'>
                          <p className="uppercase py-2 h1 text-red-500 font-bold">Payment Error</p>
                          <p className="pt-6 pb-2">{paymentError}!</p>
                          <p className="pb-6 italic text-xs text-gray-400">{paymentErrorDetails}!</p>
                          <p className="py-6"><ToggleContactDetails competition={competition} message="PayID Information" /></p>
                          <p className="py-6 pb-12">If you would to pay using PayID, please include <span className="font-bold">AVTA{competition.maxPoint} - YourName</span> as reference</p>
                          <p className="py-6 pb-12">If you would to pay using Credit Card, please go back to competition home page and click on <span className="font-bold">Pay Now</span> try make payment again.</p>
                          <Link href={`/competitions/${competition.slug}?view=teams`}>
                            <a
                              className='bg-blue-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 w-full sm:w-32 text-center mb-8'
                            >
                              Go Back to Competition
                            </a></Link>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </>)}
    </Layout >
  );
}

export async function getStaticProps({ params, preview = false }) {
  let data = await getCompetitionBySlug(params.slug, preview);

  return {
    props: {
      preview,
      competition: data,
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const all = await getAllCompetitionsForHome();
  return {
    paths: all?.map(({ slug }) => `/competitions/${slug}/postpayment`) ?? [],
    fallback: true,
  };
}
