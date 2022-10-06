import PlayerRankingCard from './PlayerRankingCard';

export default function LadderRankingsCard({ ranking, players, ladder }) {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full'>
          {ranking.map((player, index) => (
            <PlayerRankingCard
              key={index}
              player={player}
              registeredPlayers={players}
              index={index}
              ladder={ladder}
            />
          ))}
        </div>
      </div>
    </>
  );
}
