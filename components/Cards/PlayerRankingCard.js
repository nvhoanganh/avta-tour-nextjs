import cn from 'classnames';
import PlayerAvatar from './PlayerAvatar';
import PlayerPoint from '../PlayerPoint';
export default function PlayerRankingCard({ player, index, registeredPlayers }) {
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
                <span>{index + 1}. {player.player.displayName || player.player.fullName}</span>

                {isRegistered &&
                  <i className="fas fa-money-bill text-green-600" title={`Paid on ${isRegistered.paidOn}`}></i>
                }
              </div>
              <div className='text-sm text-gray-600 flex space-x-2'>
                {player.win + player.lost > 0 ?
                  <>
                    <span>{player.win + player.lost} Matches <span className='text-green-600'>{player.win}</span>
                      /<span className='text-red-600'>{player.lost}</span></span>
                  </> : '-'
                }

                {player.winPercentage > 0 &&
                  <span>Game W/L: <span
                    className={cn({
                      'text-gray-600': Number(player.winPercentage) === 100,
                      'text-green-600': Number(player.winPercentage) > 100,
                      'text-red-600': Number(player.winPercentage) < 100,
                    })}
                  >{player.winPercentage}%</span></span>
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
