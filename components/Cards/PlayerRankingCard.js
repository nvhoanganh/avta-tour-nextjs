import cn from 'classnames';

export default function PlayerRankingCard({ player, index }) {
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
                <span>{index + 1}. {player.player.fullName}</span>
              </div>
              <div className='text-sm text-gray-600 flex space-x-2'>
                <span className='text-green-600'>{player.player.avtaPoint} pt.</span>

                {player.win + player.lost > 0 ?
                  <>
                    <span>Match: <span className='text-green-600'>{player.win}</span>
                      /<span className='text-red-600'>{player.lost}</span></span>
                  </> : ''
                }

                {player.winPercentage > 0 &&
                  <span>Win Per.: <span
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
              {/* <TeamAvatar team={team} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
