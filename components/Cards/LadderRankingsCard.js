import PlayerRankingCard from './PlayerRankingCard';

export default function LadderRankingsCard({ ranking, players }) {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {ranking.map((player, index) => (
            <PlayerRankingCard
              key={player.id}
              player={player}
              registeredPlayers={players}
              index={index}
            />
          ))}
        </div>
      </div>
    </>
  );
}
