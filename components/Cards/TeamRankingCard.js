import React from "react";
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import { format } from 'date-fns'

export default function TeamRankingCard({ team, index }) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-3 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap ">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <div
                className=
                'font-bold flex space-x-1 text-gray-600 '
              >
                <span>{index + 1}.</span>
                <Link href={`/players/${team.player1.nickName}`}>
                  <a className="hover:underline">{team.player1.fullName}</a>
                </Link>

                <span className='font-normal text-xs mb-2 text-green-600'>{team.player1.avtaPoint}</span>

                <span className="px-1">&amp;</span>

                <Link href={`/players/${team.player2.nickName}`}>
                  <a className="hover:underline">{team.player2.fullName}</a>
                </Link>

                <span className='font-normal text-xs mb-2 text-green-600'>{team.player2.avtaPoint}</span>
              </div>
              <div className='text-sm text-gray-600 flex space-x-2'>
                <span className='text-green-600'>{team.player1.avtaPoint + team.player2.avtaPoint} pt.</span>
                <span>Set: <span className='text-green-600'>{team.SetWon}</span>
                  /<span className='text-red-600'>{team.SetLost}</span></span>

                <span>Game: <span
                  className={cn({
                    'text-gray-600': Number(team.Difference) === 0,
                    'text-green-600': Number(team.Difference) > 0,
                    'text-red-600': Number(team.Difference) < 0,
                  })}
                >{Number(team.Difference) > 0 ? "+" : ""}{team.Difference}</span></span>

              </div>
            </div>

            <div className="relative w-auto pl-4 flex-initial flex">
              <img
                src={team.player1.coverImage?.url || 'https://via.placeholder.com/64'}
                alt='...'
                className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
              ></img>
              <img
                src={team.player2.coverImage?.url || 'https://via.placeholder.com/64'}
                alt='...'
                className='w-10 h-10 rounded-full border-2 border-gray-50 shadow -ml-2'
              ></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
