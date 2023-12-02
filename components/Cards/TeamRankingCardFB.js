import React from "react";
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
import { format } from 'date-fns'
import { getPriceId } from '../../lib/browserapi'

export default function TeamRankingCard({ team, index, is_superuser, editTeam, competition }) {
  const players = team.players ? team.players : [team.player1, team.player2];
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-3 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap ">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <div
                className=
                'flex space-x-1 text-gray-600 '
              >
                <span>{index + 1}. {players[0].fullName} + {players[1].fullName}</span>
                {team.paidOn &&
                  <i className="fas fa-money-bill text-green-600" title={`Paid on ${team.paidOn}`}></i>}
              </div>
              <div className='text-sm text-gray-600 flex space-x-2'>
                <span className={team.isOverLimit ? 'text-yellow-600' : 'text-green-600'}>{players[0].avtaPoint + players[1].avtaPoint} pt.</span>

                {team.win + team.lost > 0 ?
                  <>
                    <span>Set: <span className='text-green-600'>{team.win}</span>
                      /<span className='text-red-600'>{team.lost}</span></span>
                  </> : ''
                }

                {team.diff > -1000 &&
                  <span>Game: <span
                    className={cn({
                      'text-gray-600': Number(team.diff) === 0,
                      'text-green-600': Number(team.diff) > 0,
                      'text-red-600': Number(team.diff) < 0,
                    })}
                  >{Number(team.diff) > 0 ? "+" : ""}{team.diff}</span></span>
                }
                {is_superuser &&
                  <div onClick={() => editTeam && editTeam(team)}
                    className="ml-2 underline cursor-pointer hover:text-blue-600">
                    Edit
                  </div>
                }

                {!team.paidOn && competition?.costPerTeam > 0 && (<form
                  action={`/api/checkout_sessions?applicationId=${team.id}&competition=${team.slug}&priceId=${getPriceId(competition, team)}`} method="POST"
                  className="relative flex flex-col min-w-0 break-words mb-6 border-0 justify-center items-center"
                >
                  <button type="submit" className='text-sm text-red-600 flex space-x-2 hover:underline hover:cursor-pointer font-bold'>
                    Pay Now
                  </button>
                </form>)
                }
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
