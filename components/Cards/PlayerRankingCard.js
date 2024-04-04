import Link from 'next/link';
import cn from 'classnames';
import PlayerAvatar from './PlayerAvatar';
import PlayerPoint from '../PlayerPoint';
export default function PlayerRankingCard({ player, index, registeredPlayers, ladder }) {
  const isRegistered = registeredPlayers?.find(p => p.playerId === player.player.uid);

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
                <Link href={`/players/${player.player.playerId}`}>
                  <span className="cursor-pointer hover:underline">{index + 1}. {player.player.displayName || player.player.fullName}</span>
                </Link>

                {isRegistered &&
                  <i className={isRegistered.payment_intent ? 'fab fa-cc-stripe text-purple-600' : 'fas fa-money-bill text-green-600'} title={`Paid on ${isRegistered.paidOn} ${isRegistered.payment_intent || ' - Cash'}`}></i>
                }
              </div>
              <div className='text-sm text-gray-600 flex space-x-1'>
                {player.win + player.lost > 0 ?
                  <>
                    <span><span className="text-xs text-gray-400">Match: </span>{player.win + player.lost}
                      <span
                        className={cn('', {
                          'text-gray-600': Number(player.win - player.lost) === 0,
                          'text-green-600': Number(player.win - player.lost) > 0,
                          'text-red-600': Number(player.win - player.lost) < 0,
                        })}

                      >({player.win - player.lost > 0 ? "+" : ''}{player.win - player.lost})</span>
                    </span>
                  </> : '-'
                }

                {player.winPercentage > 0 &&
                  <span><span className="text-xs text-gray-400">{ladder.orderRule === 'GAMEWON' ? 'Game' : 'Won'}: </span>
                    <span
                      className='text-gray-600'
                    >{ladder.orderRule === 'GAMEWON' ? player.winPercentage : player.matchWinPercentage}%
                      <span className='text-xs ml-1'>
                        (g:<span className='text-green-600'>{player.gameWin}</span>
                        /<span className='text-red-600'>{player.gameLost}</span>)
                      </span>

                    </span></span>
                }
              </div>
            </div>

            <div className="relative w-auto pl-4 flex-initial flex">
              <PlayerAvatar player={player.player} />
              <PlayerPoint player={player.player} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
