import React from "react";
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from "prop-types";
import { format } from 'date-fns'

export default function TeamAvatar({ team }) {
  return (
    <>
      <div className="flex flex-col">
        <img
          src={team.player1.coverImage?.url || 'https://via.placeholder.com/64'}
          alt='...'
          className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
        ></img>
        <div className='text-green-600 text-xs text-center'>{team.player1.avtaPoint}</div>
      </div>
      <div className="flex flex-col -ml-2">
        <img
          src={team.player2.coverImage?.url || 'https://via.placeholder.com/64'}
          alt='...'
          className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
        ></img>
        <div className='text-green-600 text-xs text-center'>{team.player2.avtaPoint}</div>
      </div>
    </>
  );
}
