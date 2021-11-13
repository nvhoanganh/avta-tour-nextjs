import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export default function PostBody({ content }) {
	return (
		<div className='prose text-lg'>
			{documentToReactComponents(content.json)}
		</div>
	);
}
