import Link from 'next/link'
import SaveButton from '../../components/savebutton';
import { RevalidatePath } from '../../lib/browserapi';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../authhook';
import { useState, useEffect } from 'react'
import Spinner from '../../components/spinner';
import {
  getPlayerById,
} from '../../lib/browserapi';
import { PLAYER_STYLE } from '../../lib/constants';
import { db } from '../../lib/firebase';
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export default function UserProfile() {
  const { user, loadingAuth } = useFirebaseAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userRoles, setUserRoles] = useState(null);

  const onSubmit = async data => {
    setSaving(true)

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    let updated = docSnap.exists() ? { ...docSnap.data(), ...data } : { ...data, uid: user.uid };

    if (!updated.photoURL) {
      updated = { ...updated, photoURL: user.photoURL };
    }

    if (!updated.playerId) {
      updated = { ...updated, notInContentful: true, fullName: updated.displayName };
    }

    await setDoc(docRef, updated);

    if (updated.playerId) {
      const unsubref = doc(db, "unsubscribed", updated.playerId);
      if (updated.stopSms) {
        await setDoc(unsubref, {
          unsubscribeDate: (new Date())
        });
      } else {
        const unsubSnap = await getDoc(unsubref);
        if (unsubSnap.exists()) {
          await deleteDoc(unsubref);
        }
      }

      await RevalidatePath(user, `/players/${updated.playerId}`);
    }

    toast("Profile Updated");
    setSaving(false)
  };

  useEffect(async () => {
    if (!loadingAuth && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      let formData = docSnap.exists() ? { ...user, ...docSnap.data() } : { ...user, allowContact: true };
      if (formData.playerId) {
        // get data fron contentful using REST api
        const contentfuldata = await getPlayerById(formData.playerId, false);

        formData = {
          ...formData, ...contentfuldata,
          stopSms: false,
          displayName: formData.displayName || contentfuldata.fullName,
          // home club and nick Name comes from what user type in the form, not from contentful
          homeClub: formData.homeClub,
          nickName: formData.nickName,
        };

        const unsubSnap = await getDoc(doc(db, "unsubscribed", formData.playerId));
        if (unsubSnap.exists()) {
          console.log('this user unsubscribed');
          formData = {
            ...formData,
            stopSms: true
          }
        }
      }

      setUserProfile(formData);

      const roleSnap = await getDoc(doc(db, "user_roles", user.uid));
      if (roleSnap.exists()) {
        setUserRoles(roleSnap.data());
      }
    } else {
      setUserRoles(null)
    }
  }, [user, loadingAuth]);

  return (
    <>
      <ToastContainer />
      {
        loadingAuth || !userProfile
          ? <div className="text-center py-24"><Spinner size="lg" color="blue" /> Fetching information...</div> :
          <UserForm onSubmit={onSubmit} userProfile={userProfile} saving={saving} userRoles={userRoles} />
      }
    </>
  );
}

function UserForm({ onSubmit, userProfile, saving, userRoles }) {
  const [showHowToGetPoint, setShowHowToGetPoint] = useState(false);
  const { displayName, email, mobileNumber, suburb,
    allowContact, stopSms, aboutMe, homeClub, nickName, avtaPoint, unofficialPoint, playStyle, perfectPartner, playerId, pointChangeLog } = userProfile;

  const formSchema = Yup.object().shape({
    displayName: Yup.string()
      .required('Display name is mandatory')
      .min(3, 'Must be at 3 char long'),
    nickName: Yup.string()
      .required('Nickname is mandatory')
      .min(3, 'Nickname must be at 3 char long'),
    mobileNumber: Yup.string().when("mobileNumber", (val, schema) => {
      if (val?.length > 0) {
        return Yup.string()
          .matches(/\+614\d{8}/, 'Enter mobile in format +61412345678');
      }
      else {
        return Yup.string().notRequired();
      }
    }),
    homeClub: Yup.string()
      .required('Home Club is mandatory')
      .min(3, 'Home Club must be at 3 char long'),
    suburb: Yup.string()
      .required('Suburb is mandatory')
      .min(3, 'Suburb must be at 3 char long'),
    email: Yup.string().email()
      .required('Email is mandatory'),
    playStyle: Yup.string()
      .required('Select your play style'),
    perfectPartner: Yup.string()
      .required('Select your prefer partner play style'),
  }, [
    ["mobileNumber", "mobileNumber"], // cyclic dependencies
  ]);

  const { register, reset, handleSubmit, watch, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: {
      displayName, email, mobileNumber,
      suburb, allowContact, aboutMe, homeClub, nickName,
      playStyle, perfectPartner,
      stopSms: stopSms || false
    },
    resolver: yupResolver(formSchema),
  });



  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6  border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
            User Information {userRoles?.superuser && ' [Admin User]'}
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Display Name
                </label>
                <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("displayName")} />
              </div>
              {errors?.displayName?.message && (
                <div className='relative bg-gray-300'>
                  <div className='absolute left-0 top-0 flex justify-end w-full -mt-1'>
                    <span className='bg-white text-xs text-red-600'>
                      {errors?.displayName?.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-6/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Nick Name
                </label>
                <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("nickName")} />
              </div>
              {errors?.nickName?.message && (
                <div className='relative bg-gray-300'>
                  <div className='absolute left-0 top-0 flex justify-end w-full -mt-1'>
                    <span className='bg-white text-xs text-red-600'>
                      {errors?.nickName?.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-6/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  AVTA Score
                </label>
                {avtaPoint ? <span className={`px-3 py-3 text-gray-600 text-4xl  ${unofficialPoint ? 'text-red-600' : 'text-green-600'}`}>{avtaPoint} Pt. {unofficialPoint ? '(Unofficial)' : ''}
                  {pointChangeLog && <div className='text-sm italic font-normal text-gray-500'><i className="fas fa-history"></i> {pointChangeLog}</div>}
                </span> :
                  <span className="py-3  text-red-600">Not Yet Assigned.
                    <a className="underline cursor-pointer text-gray-600 mx-2" onClick={() => setShowHowToGetPoint(true)}>How do I get one?</a>
                  </span>
                }

                {showHowToGetPoint &&
                  <div className="py-3 my-4 border rounded shadow-xl px-3 bg-gray-50">
                    <p>
                      If you believe a player profile has been created for you. You can find and claim it <Link href={`/players`}>
                        <a target='_blank' className="underline cursor-pointer text-gray-600 mx-1">here</a>
                      </Link>.
                    </p>

                    <p className="pt-5">
                      Otherwise, contact one of our
                      <Link href={`/players/map`}>
                        <a target='_blank' className="underline cursor-pointer text-gray-600 mx-1">AVTA Score markers</a>
                      </Link>
                      close to you to organize a skill check match. You will be given a preliminary AVTA Point when you participate in one of our upcoming
                      <Link href={`/competitions`}>
                        <a target='_blank' className="underline cursor-pointer text-gray-600 mx-1">competitions</a>
                      </Link>
                      . Your official AVTA point will be given to you by AVTA Skill Review Panel

                      <p className="pt-5">
                        <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" type="button"
                          onClick={() => setShowHowToGetPoint(false)}
                        >
                          Got it!
                        </button>
                      </p>
                    </p>
                  </div>}
              </div>
            </div>
            <div className="w-full lg:w-6/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Home Club
                </label>
                <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  {...register("homeClub")} />
              </div>
              {errors?.homeClub?.message && (
                <div className='relative bg-gray-300'>
                  <div className='absolute left-0 top-0 flex justify-end w-full -mt-1'>
                    <span className='bg-white text-xs text-red-600'>
                      {errors?.homeClub?.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Contact Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Mobile
                </label>
                <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("mobileNumber")}
                  placeholder="+61412345678" />
              </div>
              {errors?.mobileNumber?.message && (
                <div className='relative bg-gray-300'>
                  <div className='absolute left-0 top-0 flex justify-end w-full -mt-1'>
                    <span className='bg-white text-xs text-red-600'>
                      {errors?.mobileNumber?.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-4/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Suburb
                </label>
                <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  {...register("suburb")} />
              </div>
              {errors?.suburb?.message && (
                <div className='relative bg-gray-300'>
                  <div className='absolute left-0 top-0 flex justify-end w-full -mt-1'>
                    <span className='bg-white text-xs text-red-600'>
                      {errors?.suburb?.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-4/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Email
                </label>
                <input type="email"
                  {...register("email")}
                  className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
              </div>
              {errors?.email?.message && (
                <div className='relative bg-gray-300'>
                  <div className='absolute left-0 top-0 flex justify-end w-full -mt-1'>
                    <span className='bg-white text-xs text-red-600'>
                      {errors?.email?.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-4/12 sm:px-4 py-3">
              <div className="relative w-full mb-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input id="customCheckLogin" type="checkbox" className="form-checkbox border rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150" {...register("allowContact")} />
                  <span className="ml-2 text-sm font-semibold text-blueGray-600">Show my contact details to other logged in players</span>
                </label>
              </div>
            </div>
            {
              playerId
              && <div className="w-full lg:w-4/12 sm:px-4 py-3">
                <div className="relative w-full mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input id="customCheckLogin" type="checkbox" className="form-checkbox border rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150" {...register("stopSms")}
                      onChange={(e) => e.target.checked && alert('Note: you will stop receive notification about upcoming AVTA Tournaments')}
                    />
                    <span className="ml-2 text-sm font-semibold text-blueGray-600">Opt-out from AVTA SMS notification</span>
                  </label>
                </div>
              </div>
            }
          </div>

          <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
            About Me
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Play Style
                </label>
                <select className="appearance-none
        border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                  {...register("playStyle")}
                >
                  <option value={PLAYER_STYLE.AllCourt}>{PLAYER_STYLE.AllCourt}</option>
                  <option value={PLAYER_STYLE.Baseliner}>{PLAYER_STYLE.Baseliner}</option>
                  <option value={PLAYER_STYLE.NetRusher}>{PLAYER_STYLE.NetRusher}</option>
                  <option value={PLAYER_STYLE.Pusher}>{PLAYER_STYLE.Pusher}</option>
                </select>
              </div>
              {errors?.playStyle?.message && (
                <div className='relative bg-gray-300'>
                  <div className='absolute left-0 top-0 flex justify-end w-full -mt-1'>
                    <span className='bg-white text-xs text-red-600'>
                      {errors?.playStyle?.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-4/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Perfect Partner
                </label>
                <select className="appearance-none
        border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                  {...register("perfectPartner")}
                >
                  <option value={PLAYER_STYLE.AllCourt}>{PLAYER_STYLE.AllCourt}</option>
                  <option value={PLAYER_STYLE.Baseliner}>{PLAYER_STYLE.Baseliner}</option>
                  <option value={PLAYER_STYLE.NetRusher}>{PLAYER_STYLE.NetRusher}</option>
                  <option value={PLAYER_STYLE.Pusher}>{PLAYER_STYLE.Pusher}</option>
                </select>
              </div>
              {errors?.perfectPartner?.message && (
                <div className='relative bg-gray-300'>
                  <div className='absolute left-0 top-0 flex justify-end w-full -mt-1'>
                    <span className='bg-white text-xs text-red-600'>
                      {errors?.perfectPartner?.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-4/12 sm:px-4">
              <div className="relative w-full mb-3">
              </div>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  About me
                </label>
                <textarea type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="4" {...register("aboutMe")}></textarea>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap pt-5">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 text-center">
                <SaveButton saving={saving}
                  type="submit">Update Profile</SaveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form >
  );
}
