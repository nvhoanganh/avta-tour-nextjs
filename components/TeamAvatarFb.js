import React from "react";
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from "prop-types";
import { format } from 'date-fns'
import PlayerPoint from './PlayerPoint';

export default function TeamAvatar({ team }) {
  const players = team.players ? team.players : [team.player1, team.player2];
  return (
    <>
      <Link href={`/players/${players[0]?.sys?.id}`}>
        <div className="flex flex-col">
          <img
            src={players[0]?.coverImage?.url || 'https://via.placeholder.com/64'}
            alt='...'
            className='w-10 hover:cursor-pointer hover:shadow-xl hover:border-gray-700 h-10 rounded-full border-2 border-gray-50 shadow'
          ></img>
          <PlayerPoint player={players[0]} />
        </div>
      </Link>
      <Link href={`/players/${players[1]?.sys?.id}`}>
        <div className="flex flex-col -ml-2">
          <img
            src={players[1]?.coverImage?.url || 'https://via.placeholder.com/64'}
            alt='...'
            className='w-10 hover:cursor-pointer hover:shadow-xl hover:border-gray-700 h-10 rounded-full border-2 border-gray-50 shadow'
          ></img>
          <PlayerPoint player={players[1]} />
        </div>
      </Link>
    </>
  );
}
