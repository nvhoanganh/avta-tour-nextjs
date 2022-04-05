import PlayerRankingCard from './PlayerRankingCard';

export default function LadderRankingsCard({ ranking, players }) {
  console.log("🚀 ~ file: LadderRankingsCard.js ~ line 4 ~ LadderRankingsCard ~ ranking", ranking)
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {ranking.map((player, index) => (
            <PlayerRankingCard
              key={index}
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
