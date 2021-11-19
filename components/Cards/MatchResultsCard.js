import React from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import { format } from 'date-fns'

export default function MatchResultsCard({ results }) {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {(results || []).map((result) => (
            <div key={result.datetime} className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap ">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div
                      className=
                      'font-bold flex space-x-1 text-gray-600 '
                    >

                      <Link href={`/players/${result.winners.player1.nickName}`}>
                        <a className="hover:underline">{result.winners.player1.fullName}</a>
                      </Link>

                      <span className='font-normal text-xs mb-2 text-green-600'>{result.winners.player1.avtaPoint}</span>

                      <span className="px-1">&amp;</span>

                      <Link href={`/players/${result.winners.player2.nickName}`}>
                        <a className="hover:underline">{result.winners.player2.fullName}</a>
                      </Link>

                      <span className='font-normal text-xs mb-2 text-green-600'>{result.winners.player2.avtaPoint}</span>
                    </div>
                    <div className='text-sm text-gray-600'>
                      GROUP {result.winners.groupName} - Team Pt. {result.winners.player1.avtaPoint + result.winners.player2.avtaPoint} - {format(new Date(result.datetime), 'h:mm a')}
                    </div>
                  </div>

                  {/* icon */}
                  <div className="relative w-auto pl-4 flex-initial flex">
                    <img
                      src={result.winners.player1.coverImage?.url || 'https://via.placeholder.com/64'}
                      alt='...'
                      className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
                    ></img>
                    <img
                      src={result.winners.player2.coverImage?.url || 'https://via.placeholder.com/64'}
                      alt='...'
                      className='w-10 h-10 rounded-full border-2 border-gray-50 shadow -ml-2'
                    ></img>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className=' text-gray-600 py-2 text-lg align-center'>
                    6-{result.score}
                  </div>
                </div>
                <div className="flex flex-wrap mt-2">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div
                      className=
                      'font-bold flex space-x-1 text-gray-600'
                    >

                      <Link href={`/players/${result.losers.player1.nickName}`}>
                        <a className="hover:underline">{result.losers.player1.fullName}</a>
                      </Link>

                      <span className='font-normal text-xs mb-2 text-green-600'>{result.losers.player1.avtaPoint}</span>

                      <span className="px-1">&amp;</span>


                      <Link href={`/players/${result.losers.player2.nickName}`}>
                        <a className="hover:underline">{result.losers.player2.fullName}</a>
                      </Link>

                      <span className='font-normal text-xs mb-2 text-green-600'>{result.losers.player2.avtaPoint}</span>
                    </div>
                    <div className='text-sm text-gray-600'>
                      GROUP {result.losers.groupName} - Team Pt. {result.losers.player1.avtaPoint + result.losers.player2.avtaPoint}
                    </div>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial flex">
                    <img
                      src={result.losers.player1.coverImage?.url || 'https://via.placeholder.com/64'}
                      alt='...'
                      className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
                    ></img>
                    <img
                      src={result.losers.player2.coverImage?.url || 'https://via.placeholder.com/64'}
                      alt='...'
                      className='w-10 h-10 rounded-full border-2 border-gray-50 shadow -ml-2'
                    ></img>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
