import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { getSummaryMatchup } from '../lib/browserapi';

export default function SummaryPossibleMatches({ matches }) {
	const data = getSummaryMatchup(matches);

	return (<div className='grid grid-cols-3 gap-x-5 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-10 mb-16'>
		{Object.keys(data).map(k => (<div
			className='p-3 rounded shadow border border-gray-200 bg-indigo-100'
			key={k}>
			<span className='font-semibold'>{k.trim()}</span>:<span className='pl-2'>{data[k]}</span>
		</div>))}
	</div>
	);
}
