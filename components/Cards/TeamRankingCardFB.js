import React from "react";
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
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
                <span>{index + 1}. {team.players[0].nickName} + {team.players[1].nickName}</span>
              </div>
              <div className='text-sm text-gray-600 flex space-x-2'>
                <span className='text-green-600'>{team.players[0].avtaPoint + team.players[1].avtaPoint} pt.</span>
                <span>Set: <span className='text-green-600'>{team.win}</span>
                  /<span className='text-red-600'>{team.lost}</span></span>

                <span>Game: <span
                  className={cn({
                    'text-gray-600': Number(team.diff) === 0,
                    'text-green-600': Number(team.diff) > 0,
                    'text-red-600': Number(team.diff) < 0,
                  })}
                >{Number(team.diff) > 0 ? "+" : ""}{team.diff}</span></span>

              </div>
            </div>

            <div className="relative w-auto pl-4 flex-initial flex">
              <TeamAvatar team={team} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}