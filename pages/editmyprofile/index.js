import { useRouter } from 'next/router';
import AvatarEditor from "react-avatar-editor";
import Link from 'next/link';
import Head from 'next/head';
import { ToastContainer, toast } from 'react-toastify';
import ErrorPage from 'next/error';
import ContentfulImage from '../../components/contentful-image';
import Container from '../../components/container';
import FloatingFileInput from '../../components/floatingFileInput';
import PostBody from '../../components/post-body';
import MoreStories from '../../components/more-stories';
import Header from '../../components/header';
import PostHeader from '../../components/post-header';
import Layout from '../../components/layout';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import ProfileSettings from '../../components/Cards/UserProfile';
import SendOtp from '../../components/sendotp';
import { useFirebaseAuth } from '../../components/authhook';
import { useEffect, useState, useRef } from 'react'
import { db } from '../../lib/firebase';
import { setDoc, query, collection, doc, getDocs, getDoc, where } from "firebase/firestore";


export default function EditMyProfile() {
  const router = useRouter();
  const avatarRef = useRef(null);
  const [linkedPlayer, setLinkedPlayer] = useState(null);
  const [userAvatar, setUserAvatar] = useState({
    rotate: 0,
    photo: null,
    zoom: 1.2,
  });

  const { user } = useFirebaseAuth();

  const viewProfile = () => {
    window.location.pathname = `/players/${linkedPlayer}`;
  }

  useEffect(async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const formData = docSnap.exists() ? { ...user, ...docSnap.data() } : user;
      if (formData.playerId) {
        setLinkedPlayer(formData.playerId);
      }
    }
  }, [user]);

  const saveProfilePhoto = (field, value) => {
    setUserAvatar(curr => ({ ...curr, [field]: value }));
  };

  const updateUserProfilePhoto = async () => {
    const dataUrl = avatarRef.current.getImageScaledToCanvas().toDataURL();

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    const updated = docSnap.exists() ? { ...docSnap.data(), photoURL: dataUrl } : { uid: user.uid, photoURL: dataUrl };
    await setDoc(docRef, updated);

    toast("Avatar Updated");
  };

  return (
    <Layout preview={false}>
      <ToastContainer />
      <Navbar transparent />

      <article>
        <Head>
          <title>Edit Profile | AVTA.</title>
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
                      {user?.photoURL ? (
                        <div className='rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px text-center'>
                          <ContentfulImage
                            width={250}
                            height={250}
                            className='rounded-full'
                            src={
                              user?.photoURL
                            }
                          />

                          <FloatingFileInput
                            name="photo"
                            errorMessage=""
                            setValue={saveProfilePhoto}
                            disabled={false}
                            isValid={true}
                            button={
                              <a
                                className='uppercase bg-gray-100  font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none 
                            focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                              >
                                <i className="far fa-edit"></i> Edit
                              </a>
                            }
                          ></FloatingFileInput>
                        </div>
                      ) : (
                        <img
                          alt={user?.displayName}
                          src='https://via.placeholder.com/150'
                          className='rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px'
                        />
                      )}
                    </div>
                  </div>
                  <div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center'>
                    <div className='py-6 px-3 mt-32 sm:mt-0 w-full text-center md:text-right'>
                      {linkedPlayer &&
                        <a
                          className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none 
                            focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                          onClick={viewProfile}
                        >
                          View Public Profile
                        </a>
                      }
                    </div>
                  </div>
                  <div className='w-full lg:w-4/12 px-4 lg:order-1'>
                    <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                    </div>
                  </div>
                </div>

                {userAvatar.photo && (
                  <div className='py-10'>
                    <div className="mx-auto border shadow-sm w-80 flex justify-center">
                      <AvatarEditor
                        ref={avatarRef}
                        image={userAvatar.photo}
                        width={200}
                        borderRadius={100}
                        height={200}
                        border={50}
                        color={[255, 255, 255, 0.6]} // RGBA
                        scale={userAvatar.zoom}
                        rotate={userAvatar.rotate}
                      />
                    </div>

                    {/* rotate, zoom in and out */}
                    <div className="py-4 mx-auto text-center">
                      <div className="flex space-x-4 justify-center" role="group">
                        <button
                          type="button"
                          onClick={() =>
                            saveProfilePhoto("rotate", (90 + userAvatar.rotate) % 360)
                          }
                          className="uppercase bg-gray-100  font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none
                          focus:outline-none mb-1 ease-linear transition-all duration-150"
                        >
                          <i className="fas fa-sync"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => saveProfilePhoto("zoom", userAvatar.zoom + 0.2)}
                          className="uppercase bg-gray-100  font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none
                          focus:outline-none mb-1 ease-linear transition-all duration-150"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                        <button
                          onClick={() => saveProfilePhoto("zoom", userAvatar.zoom - 0.2)}
                          type="button"
                          className="uppercase bg-gray-100  font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none
                          focus:outline-none mb-1 ease-linear transition-all duration-150"
                        >
                          <i className="fas fa-minus"></i>
                        </button>

                      </div>
                    </div>

                    {/* Allow user to edit the icon */}
                    <div className="flex justify-center pt-1 space-x-2">
                      <button
                        onClick={updateUserProfilePhoto}
                        className='uppercase bg-blue-600 text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none 
                            focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { saveProfilePhoto('photo', null) }}
                        type="button"
                        className="uppercase bg-gray-200  font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none
                          focus:outline-none mb-1 ease-linear transition-all duration-150"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <div className='mt-12'>
                  <ProfileSettings></ProfileSettings>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}