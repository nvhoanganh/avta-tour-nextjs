import cn from 'classnames';

export default function PlayerStyleFilter({ setState, selected }) {
  const types = ['All', 'Baseliner', 'All-Court', 'Serve and Volley', 'Pusher'];
  return (<div className="text-center flex space-x-2 justify-center items-center pb-3">
    {types.map(x => (
      <a key={x} onClick={() => setState(x)}
        className={cn('hover:cursor-pointer border-t-0 px-1 text-sm italic rounded py-1 align-middle border-l-0 hover:bg-gray-400 border-r-0 whitespace-nowrap p-4 cursor-pointer bg-gray-100', {
          'bg-gray-500 text-white': selected === x,
        })}
      >
        {x}
      </a>
    ))}
  </div>)
}