import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Spinner from '../../../components/spinner';
import Layout from '../../../components/layout';
import PostTitle from '../../../components/post-title';
import SendInviteViaSms from '../../../components/Cards/SendInviteViaSms';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import { useFirebaseAuth } from '../../../components/authhook2';
import { useState } from 'react';
import {
  getAllPlayers,
  getAllCompetitionsForHome,
  getCompetitionBySlug,
  getRulebyId,
} from '../../../lib/api';
import { mergeUsersAndPlayersData } from "../../../lib/backendapi";
import { ToastContainer, toast } from 'react-toastify';


export default function SendInvite({ competition, allPlayers, rule, preview }) {
  const router = useRouter();
  const { user, loading } = useFirebaseAuth({ protectedRoute: true, reason: 'sendsms' })

  return (
    <Layout preview={false}>
      <ToastContainer></ToastContainer>
      <Navbar transparent />

      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <article>
            <Head>
              <title>Send Sms to players - {competition.title} - Max {competition.maxPoint}{' '}
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
                        loading
                          ?
                          <div className='text-center py-28'><Spinner color="blue"></Spinner> Loading...</div> :
                          <>
                            <div className=' text-2xl bold text-center pb-2 uppercase'>Send SMS to players</div>
                            <div className='text-center pb-8'>
                              <Link href={`/competitions/${competition.slug}`}><a
                                className='underline ml-2'
                              >
                                Go Back
                              </a></Link></div>
                            <SendInviteViaSms competition={competition} players={allPlayers} ></SendInviteViaSms>
                          </>
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

  let allPlayers = (await getAllPlayers(preview)) ?? [];
  allPlayers = await mergeUsersAndPlayersData(allPlayers);

  const rule = await getRulebyId(data.ruleId || process.env.DEFAULT_RULE, preview);

  return {
    props: {
      preview,
      competition: data,
      rule: rule[0].rule,
      allPlayers
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const all = await getAllCompetitionsForHome();
  return {
    paths: all?.map(({ slug }) => `/competitions/${slug}/sendsms`) ?? [],
    fallback: true,
  };
}
