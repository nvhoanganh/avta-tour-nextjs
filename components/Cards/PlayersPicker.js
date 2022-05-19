import { getPlayers } from '../../lib/browserapi';
import PlayerCard from '../PlayerCard';
import PlayerTypeFilter from './PlayerTypeFilter';

export default function PlayersPicker({ register, selectedPlayerNumber, filter, competition, otherPlayer, players, setValue, playStyleFilter, playerStyleFilterName, filterName, showSelect }) {
  const filteredPlayers = getPlayers(players, 'Point', filter, competition.maxPoint - (otherPlayer?.avtaPoint || 0), playStyleFilter);

  return (
    <>
      <input type="text"
        className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        {...register(filterName)} placeholder="Search by name, point or club" />

      <div className="py-2">
        <PlayerTypeFilter selected={playStyleFilter} setState={(val) => setValue(playerStyleFilterName, val)}></PlayerTypeFilter>
      </div>

      <div className="text-gray-400 text-sm italic text-center">{filteredPlayers.length} available players with point less than {competition.maxPoint - (otherPlayer?.avtaPoint || 0)}</div>
      <div className='flex flex-wrap justify-center pt-5 items-center'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-5 mb-32 w-full'>
          {filteredPlayers.map((player) => (
            <PlayerCard player={player} key={player.sys.id} size="md" showSelect={showSelect} onSelect={(player) => {
              setValue(selectedPlayerNumber, player);
            }} />
          ))}
        </div>
      </div>
    </>
  );
}