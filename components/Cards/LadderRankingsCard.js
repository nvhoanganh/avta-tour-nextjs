import PlayerRankingCard from './PlayerRankingCard';

export default function LadderRankingsCard({ ranking }) {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {ranking.map((player, index) => (
            <PlayerRankingCard
              player={player}
              index={index}
            />
          ))}
        </div>
      </div>
    </>
  );
}
