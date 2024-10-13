import React from "react";
import ContentfulImage from './contentful-image';
import Link from 'next/link';
import PlayerPoint from './PlayerPoint';
import cn from 'classnames';
import PlayerProfileStatus from './playerprofilestatus';
import PlayerLastComp from './playerLastComp';
import { getPlayerInitial } from '../lib/browserapi';

export default function PlayerCard({
  player,
  size,
  showSelect,
  buttonText,
  buttonColor,
  onSelect
}) {
  const sz = size === 'sm' ? 40 : size === 'md' ? 80 : 120;

  return <div key={player.sys.id} className='flex flex-row space-x-3'>
    <div className='flex items-center'>
      <Link href={`/players/${player.sys.id}`}>
        <div className='mx-auto cursor-pointer'>
          {
            player.photoURL || player.coverImage?.url
              ? <ContentfulImage width={sz} height={sz} className='rounded-full mx-auto' src={player.photoURL || player.coverImage?.url} />
              : <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-400">
                <span className="text-xl font-medium leading-none text-white">{getPlayerInitial(player)}</span>
              </span>
          }
        </div>
      </Link>
    </div>
    <div className='flex flex-col sm:items-start'>
      <div
        className='font-bold flex'
      >
        <Link href={`/players/${player.sys.id}`}>
          <a className="hover:underline">{player.fullName}</a>
        </Link>

        <PlayerPoint player={player} className="ml-1" />
      </div>

      <div className='text-sm text-gray-600'>
        {player.homeClub || 'Unknown Club'}
        <PlayerProfileStatus player={player}></PlayerProfileStatus>
      </div>




      <div className='text-sm py-1 flex space-x-1'>
        {
          player.playStyle &&
          <span className='bg-gray-200 px-1 rounded' >{player.playStyle}</span>
        }
        <PlayerLastComp player={player} prefix="Played "/>
      </div>

      {showSelect &&
        <div>
          <button className={`bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-3 mt-3 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150 ${buttonColor}`} type='button'
            onClick={() => {
              onSelect && onSelect(player)
            }}
          >
            {buttonText || "Select"}
          </button>
        </div>
      }
    </div>
  </div>;
}
