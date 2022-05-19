import React from "react";
import Link from 'next/link';
import TeamAvatar from "../TeamAvatar";
import { format } from 'date-fns'
import { getPriceId } from '../../lib/browserapi'

export default function TeamCard({
  team, is_superuser, competition, uid
}) {

  return <div className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-3 xl:mb-0 shadow-lg">
    <div className="flex-auto p-4">
      <div className="flex flex-wrap ">
        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
          <div className='font-bold flex space-x-1 text-gray-600 '>
            <span>{team.player1.fullName} &amp; {team.player2.fullName}</span>
            {team.paidOn &&
              <i className="fas fa-money-bill text-green-600" title={`Paid on ${team.paidOn}`}></i>}
          </div>
          <div className='text-gray-600 '>
            {team.player1.homeClub || team.player2.homeClub || 'Unknown Club'} - {format(new Date(team.timestamp), 'd/MM')}
          </div>
          <div className='text-sm text-gray-600 flex space-x-2'>
            <span className={team.isOverLimit ? 'text-yellow-600 font-bold' : 'text-green-600'}>{team.player1.avtaPoint + team.player2.avtaPoint} pt.</span>
            {!team.paidOn && competition.costPerTeam > 0 && (is_superuser || team.player1.uid === uid || team.player2.uid === uid) && (<form
              action={`/api/checkout_sessions?applicationId=${team.id}&competition=${team.slug}&priceId=${getPriceId(competition, team)}`} method="POST"
              className="relative flex flex-col min-w-0 break-words mb-6 border-0 justify-center items-center"
            >
              <button type="submit" className='text-sm text-red-600 flex space-x-2 hover:underline hover:cursor-pointer font-bold'>
                Pay Now
              </button>
            </form>)
            }
            {
              (is_superuser || team.player1.uid === uid || team.player2.uid === uid) && <><Link href={`/competitions/${competition.slug}/editteam?teamId=${team.id}`}>
                <a className='text-sm flex space-x-2 hover:underline hover:cursor-pointer font-bold'>
                  Edit
                </a>
              </Link></>
            }
          </div>

        </div>
        <div className="relative w-auto pl-4 flex-initial flex">
          <TeamAvatar team={team} />
        </div>
      </div>
    </div>
  </div>;
}
