import { useRouter } from 'next/router';
import Link from 'next/link'
import AvatarEditor from "react-avatar-editor";
import SaveButton from '../../../components/savebutton';
import FirebaseImage from '../../../components/fb-image';
import { RevalidatePath } from '../../../lib/browserapi';
import Head from 'next/head';
import FloatingFileInput from '../../../components/floatingFileInput';
import Layout from '../../../components/layout';
import EditLadderForm from '../../../components/editladderform';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import ProfileSettings from '../../../components/Cards/UserProfile';
import { useFirebaseAuth } from '../../../components/authhook';
import { useEffect, useState, useRef } from 'react'
import { db, storage, storageBucketId } from '../../../lib/firebase';
import { uploadBytes, ref } from 'firebase/storage';
import { setDoc, doc, getDoc, addDoc, collection } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function NewLadder() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [userprofile, setUserprofile] = useState(null);
  const [linkedPlayer, setLinkedPlayer] = useState(null);
  const { user } = useFirebaseAuth();

  useEffect(async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const formData = docSnap.exists() ? { ...user, ...docSnap.data() } : user;
      if (formData.playerId) {
        setLinkedPlayer(formData.playerId);
      }
      setUserprofile(formData);
    }
  }, [user]);

  const onSubmit = async data => {
    setSaving(true)

    let saveData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      timestamp: new Date(),
      ownerId: user.uid,
      ownerName: user.displayName,
    };

    const docRef = await addDoc(collection(db, "ladders"), saveData);
    await RevalidatePath(user, `/ladders`);
    toast("Ladder added!");

    setSaving(false)
  }

  return (
    <Layout preview={false}>
      <ToastContainer />
      <Navbar transparent />

      <article>
        <Head>
          <title>Create new Ladder | AVTA.</title>
        </Head>
      </article>

      <main className='profile-page'>
        <section className='relative block h-500-px'>
          <div
            className='absolute top-0 w-full h-full bg-center bg-cover'
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1562163928-9dba19b18778?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3273&q=80')",
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
                      <div className='rounded-full shadow-xl text-green-900 bg-gray-100 h-auto align-middle border border-gray-300 absolute -m-20 -ml-20 lg:-ml-16 max-w-300-px p-6 text-center'>
                        <i className='fas fa-award text-6xl text-yellow-400 '></i>
                        <div>
                          New Ladder
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center'>
                    <div className='py-6 px-3 mt-3 sm:mt-0 w-full text-center md:text-right'>
                    </div>
                  </div>
                  <div className='w-full lg:w-4/12 px-4 lg:order-1'>
                    <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm text-center">
                  <Link href={`/ladders`}><a
                    className='underline'
                  >
                    Go Back
                  </a></Link>
                </p>
                <div className='sm:mt-12'>
                  <EditLadderForm onSubmit={onSubmit} saving={saving} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}