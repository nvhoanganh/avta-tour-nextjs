import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Spinner from '../../../components/spinner';
import Layout from '../../../components/layout';
import PostTitle from '../../../components/post-title';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import { useFirebaseAuth } from '../../../components/authhook';
import { useEffect, useState } from 'react'
import { getLadderBasicDetails, getAllLadders } from '../../../lib/backendapi';
import { getFBUserIdFromContentfulId, RevalidatePath } from '../../../lib/browserapi';


export default function Apply({ ladder, preview }) {
  const router = useRouter();
  const { fullProfile, loading, user } = useFirebaseAuth({ protectedRoute: true, reason: 'apply' });

  const [applicationState, setApplicationState] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const goback = async () => {
    // force refresh
    await RevalidatePath(user, `/ladders/${router.query.id}`);
    router.push(`/ladders/${router.query.id}`);
  }

  useEffect(async () => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      const session_id = query.get('session_id');
      const playerId = query.get('playerId');
      return fetch(`/api/join_ladder?session_id=${query.get('session_id')}`)
        .then(response => response.json())
        .then((rsp) => {
          if (rsp.success) {
            setApplicationState({
              playerId,
              ...rsp
            });
          }
        }).catch((err) => {
          setPaymentError('Oops! Something went wrong. Please try again');
        });
    }

    if (query.get('canceled')) {
      setPaymentError('It looks like you click Cancelled button');
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
              <title>Join - {ladder.name} | AVTA.</title>
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
                            <i className='fas fa-medal text-6xl text-yellow-400'></i>
                            ${ladder.joiningFee}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='mt-24'>
                      {
                        loading && <div className='text-center py-28'><Spinner color="blue"></Spinner> Loading...</div>
                      }

                      {
                        applicationState && <div className='mb-8 text-center'>
                          <p className="uppercase py-2 h1">Payment Received</p>
                          <p className="text-gray-400 text-sm pb-6">Thanks {applicationState?.customer?.name}!</p>
                          <p className="text-gray-400 text-sm pb-6">We have received ${applicationState.amount_total / 100}.00 for your application</p>
                          <a
                            className='bg-blue-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 w-full sm:w-32 text-center mb-8'
                            onClick={goback}
                          >
                            Go Back to Ladder
                          </a>
                        </div>
                      }

                      {
                        paymentError && <div className='mb-8 text-center'>
                          <p className="uppercase py-2 h1 text-red-500">Payment Error</p>
                          <p className="text-gray-400 text-sm py-8">{paymentError}!</p>
                          <p className="text-gray-400 text-sm py-8">You can go back to competition home page and try make payment again.</p>
                          <Link href={`/ladders/${ladder.id}`}>
                            <a
                              className='bg-blue-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 w-full sm:w-32 text-center mb-8'
                            >
                              Go Back to Ladder
                            </a></Link>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </>)
      }
    </Layout >
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getLadderBasicDetails(params.id, []);

  return {
    props: {
      preview,
      ladder: data,
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const all = await getAllLadders();
  return {
    paths: all?.map(({ id }) => `/ladders/${id}/postpayment`) ?? [],
    fallback: true,
  };
}

// /http://localhost:3000/ladders/CYns8bvQyBKXMXiY6DZ1/postpayment?success=true&session_id=cs_test_a1ZjUydtscSPtUANYrvAQGnQcxj93e8GrzTn0dbB8FJBnJgmdHKCJeUCSu&playerId=CEUM7NuvI5boKxzI64V2jxSPGBh1