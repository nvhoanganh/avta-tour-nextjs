import { useRouter } from 'next/router';
import Link from 'next/link'
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import 'react-toastify/dist/ReactToastify.css';
import PlayerAvatar from '../Cards/PlayerAvatar';
import DateComponent from '../date';
import Stripepaymentinfo from '../stripepaymentinfo';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function JoinLadder({ ladder, fullProfile }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const onSubmit = async data => {
    setSaving(true)

    // const docRef = await addDoc(collection(db, "competition_applications"), data);
    setSaving(false);
  };

  return (
    <>
      <>
        <form action={`/api/checkout_ladder?playerId=${fullProfile.uid}&ladder=${ladder.id}&fee=${ladder.joiningFee}`} method="POST"
          className="relative flex flex-col min-w-0 break-words mb-6 border-0 justify-center items-center"
        >
          <p className="py-2 h1">Join <span className="font-bold">{ladder.name}</span>
          </p>
          <p className="py-6">
            <PlayerAvatar player={fullProfile} className="w-28 h-28" />
          </p>

          <div className='text-center'>
            <div className='text-sm leading-normal mt-0 mb-2  font-bold uppercase'>
              <a href={`https://maps.google.com/?q=${ladder.homeClub}`} target='_blank' className='hover:underline'>
                <i className='fas fa-map-marker-alt mr-2 text-lg '></i>{' '}
                {ladder.homeClub}
              </a>
            </div>
          </div>

          <div className='text-center'>
            <div className='leading-normal mt-0 mb-2 '>
              <a href={`https://maps.google.com/?q=${ladder.homeClub}`} target='_blank' className='hover:underline'>
                <DateComponent
                  dateString={
                    ladder.startDate
                  }
                />
                {' - '}
                <DateComponent
                  dateString={
                    ladder.endDate
                  }
                />
              </a>
            </div>
          </div>

          <div className='py-5 pb-10 px-5' dangerouslySetInnerHTML={{ __html: ladder?.rule?.replace(/\\n/g, '<br />') }}>
          </div>

          <button type="submit" role="link" className="bg-purple-500 text-white active:bg-blue-600 font-bold px-8 py-4 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200">
            Pay ${ladder.joiningFee}.00 now with Stripe.com
          </button>

          <Stripepaymentinfo></Stripepaymentinfo>
        </form>

        <p className="text-gray-400 text-sm text-center mb-12">
          <Link href={`/ladders/${ladder.id}`}><a
            className='underline ml-2'
          >
            Go Back
          </a></Link>
        </p>
      </>
    </>
  );
}