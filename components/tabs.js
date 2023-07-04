import cn from 'classnames';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Tabs({ contents, titles }) {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const { view } = router.query;

  useEffect(() => {
    if (!!view && titles) {
      const indx = titles.split(',').map(x => x.toLowerCase()).indexOf(view.toLowerCase());
      if (indx > 0) { setActiveTab(indx) }
    }
  }, [view, titles]);

  return (
    <div className="container mx-auto">
      <div className='border-b-2 border-gray-300 mt-10'>
        <ul className='flex cursor-pointer justify-around'>
          {titles.split(',').map((title, index) => (
            <li key={index} className={cn(
              'py-2 px-8 flex-grow text-center rounded-t-lg',
              {
                'bg-gray-200':
                  activeTab === index
              }
            )}
              onClick={(e) => setActiveTab(index)}
            >{title}</li>
          ))}
        </ul>
      </div>


      <div className="mx-auto mb-20 mt-3">
        {contents.map((c, i) => (<div key={i} className={cn(
          {
            'visible': activeTab === i,
            'invisible h-0': activeTab !== i,
          }
        )}>
          {c}
        </div>)
        )}
      </div>
    </div>
  );
}
