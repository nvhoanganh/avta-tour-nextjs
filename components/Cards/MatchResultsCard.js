import React from "react";
import Link from 'next/link';
import PropTypes from "prop-types";

export default function MatchResultsCard({ results }) {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {(results || []).map((result) => (
            <div className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-6 xl:mb-0 shadow-lg">
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
                      GROUP {result.winners.groupName} - Team Point {result.winners.player1.avtaPoint + result.winners.player2.avtaPoint}
                    </div>
                  </div>

                  {/* icon */}
                  <div className="relative w-auto pl-4 flex-initial">
                    <div
                      className="p-3 font-bold text-white text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-green-500"
                    >
                      6
                    </div>
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
                      GROUP {result.losers.groupName} - Team Point {result.losers.player1.avtaPoint + result.losers.player2.avtaPoint}
                    </div>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div
                      className={
                        "p-3 font-bold text-center  inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-gray-300"
                      }
                    >
                      3
                    </div>
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
