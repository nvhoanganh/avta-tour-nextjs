import cn from 'classnames';
export default function PlayerLastComp({ player, prefix }) {
  return (
    <>
      {
        player?.lastComp?.slug
          ? <a title={`Last comp played: ${player?.lastComp?.slug}`}
            className={cn('hover:cursor-pointer px-2 hover:bg-gray-500 hover:text-white rounded-lg shadow-sm', {
              'bg-yellow-600 text-white': player?.monthsSinceLastComp <= 0,
              'bg-gray-200 text-blue': player?.monthsSinceLastComp > 0,
            })}
          >
            {
              player?.monthsSinceLastComp <= 0
                ? <i className="fas fa-check-circle text-white-600"></i>
                : null
            }
            {
              player?.monthsSinceLastComp <= 0 ? ` ${player?.lastComp?.maxPoint}${player?.lastComp2 ? ' & ' : ''}${player?.lastComp2?.maxPoint || ''}` :
                `${prefix || ''}${player?.monthsSinceLastComp}m ago`
            } </a>
          : null
      }
    </>
  )
}
