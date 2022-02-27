import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import ErrorPage from 'next/error';
import ContentfulImage from '../../../components/contentful-image';
import Container from '../../../components/container';
import Spinner from '../../../components/spinner';
import PostBody from '../../../components/post-body';
import MoreStories from '../../../components/more-stories';
import Header from '../../../components/header';
import PostHeader from '../../../components/post-header';
import Layout from '../../../components/layout';
import PostTitle from '../../../components/post-title';
import Intro from '../../../components/intro';
import IndexNavbar from '../../../components/Navbars/IndexNavbar.js';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import ApplyForCompForm from '../../../components/Cards/Apply';
import SendOtp from '../../../components/sendotp';
import { useFirebaseAuth } from '../../../components/authhook';
import { useEffect, useState } from 'react'
import { db } from '../../../lib/firebase';
import { query, collection, doc, getDocs, getDoc, where } from "firebase/firestore";
import { downloadTournamentRankingResults, downloadTournamentResults, getAllPlayers, getAllCompetitionsForHome, getCompetitionBySlug, getRulebyId } from '../../../lib/api';
import { mergeUsersAndPlayersData } from "../../../lib/backendapi";


export default function Apply({ competition, allPlayers, preview }) {
  const router = useRouter();
  const { user, loadingAuth } = useFirebaseAuth();
  const [userRole, setUserRole] = useState(null);

  const goback = () => {
    router.push(`/competitions/${router.query.slug}`);
  }

  const gotoLogin = () => {
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    router.push('/auth/login?reason=apply');
  }

  useEffect(async () => {
    if (!loadingAuth) {
      if (!user) {
        gotoLogin();
        return;
      }

      const docRef = doc(db, "user_roles", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userRoles = docSnap.data();
        setUserRole(userRoles)
      }
    }
  }, [user, loadingAuth]);

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
                        loadingAuth
                          ?
                          <div className='text-center py-28'><Spinner color="blue"></Spinner> Loading...</div> :
                          <ApplyForCompForm competition={competition} players={allPlayers}></ApplyForCompForm>
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

  // to do we might need to create a different one here
  const rule = await getRulebyId('3Ktsd6k62IWkqwrqQq1qXz');
  console.log("🚀 ~ file: apply.js ~ line 149 ~ getStaticProps ~ rule", rule)

  return {
    props: {
      preview,
      competition: data,
      rule: rule,
      allPlayers
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const all = await getAllCompetitionsForHome();
  return {
    paths: all?.map(({ slug }) => `/competitions/${slug}/apply`) ?? [],
    fallback: true,
  };
}
