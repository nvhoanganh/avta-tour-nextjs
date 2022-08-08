import React from "react";
import ContentfulImage from './contentful-image';
import Link from 'next/link';

export default function PlayerWithIcon({
  player,
  size,
  showSelect,
  buttonText,
  onSelect
}) {
  const sz = size === 'sm' ? 40 : size === 'md' ? 80 : 120;

  return <div key={player.sys.id} className='px-6 text-center'>
    <Link href={`/players/${player.sys.id}`}>
      <div className='mx-auto max-w-120-px cursor-pointer'>
        {
          player.photoURL || player.coverImage?.url
            ? <ContentfulImage width={sz} height={sz} className='rounded-full mx-auto' src={player.photoURL || player.coverImage?.url} />
            : <span className="inline-flex items-center justify-center h-28 w-28 rounded-full bg-gray-400">
              <span className="text-xl font-medium leading-none text-white">{player.fullName.split(" ").map((n) => n[0]).join("")}</span>
            </span>
        }
      </div>
    </Link>

    <div className='pt-6 text-center'>
      <h5 className='text-xl font-bold'>
        <Link href={`/players/${player.sys.id}`}>
          <a className='hover:underline'>
            {player.fullName}
          </a>
        </Link>
      </h5>

      {player.fullName !== player.nickName && <p className='mt-1 text-blue-900 text-sm'>
        ({player.nickName})
      </p>}

      <p className='mt-1 text-xl text-blue-900 uppercase font-semibold'>
        {player?.avtaPoint}
      </p>
      {
        player.homeClub
          ? <p className='mt-1 text-sm text-gray-400 uppercase font-semibold'>
            {player.homeClub}
          </p>
          : null
      }
      {showSelect &&
        <button className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-8 mt-3 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150' type='button'
          onClick={() => {
            onSelect && onSelect(player)
          }}
        >
          {buttonText || "Select"}
        </button>
      }
    </div>
  </div>;
}
