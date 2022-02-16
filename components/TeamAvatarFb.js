import React from "react";
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from "prop-types";
import { format } from 'date-fns'
import PlayerPoint from './PlayerPoint';

export default function TeamAvatar({ team }) {
  return (
    <>
      <Link href={`/players/${team.players[0]?.sys?.id}`}>
        <div className="flex flex-col">
          <img
            src={team.players[0]?.coverImage?.url || 'https://via.placeholder.com/64'}
            alt='...'
            className='w-10 hover:cursor-pointer hover:shadow-xl hover:border-gray-700 h-10 rounded-full border-2 border-gray-50 shadow'
          ></img>
          <PlayerPoint player={team.players[0]} />
        </div>
      </Link>
      <Link href={`/players/${team.players[1]?.sys?.id}`}>
        <div className="flex flex-col -ml-2">
          <img
            src={team.players[1]?.coverImage?.url || 'https://via.placeholder.com/64'}
            alt='...'
            className='w-10 hover:cursor-pointer hover:shadow-xl hover:border-gray-700 h-10 rounded-full border-2 border-gray-50 shadow'
          ></img>
          <PlayerPoint player={team.players[1]} />
        </div>
      </Link>
    </>
  );
}
