import ContentfulImage from './contentful-image'
import TournamentResultCard from './Cards/TournamentResultCard';
import TournamentSummaryResultCard from './Cards/TournamentSummaryResultCard';

export default function PastResults({ player, compResults }) {
  return <div>
    <div className='mx-auto'>
      <div className="font-bold py-3 uppercase text-lg text-gray-700">Stats</div>
      <TournamentSummaryResultCard player={player} compResults={compResults}></TournamentSummaryResultCard>
      <div className="font-bold py-3 uppercase text-lg pt-12 text-gray-700">Tournament Results</div>
      <TournamentResultCard
        competitions={compResults}
      />
    </div>
  </div>
}