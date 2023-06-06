import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";

// Create a bespoke renderOptions object to target BLOCKS.EMBEDDED_ENTRY (linked block entries e.g. code blocks)
// INLINES.EMBEDDED_ENTRY (linked inline entries e.g. a reference to another blog post)
// and BLOCKS.EMBEDDED_ASSET (linked assets e.g. images)

// https://www.contentful.com/blog/rendering-linked-assets-entries-in-contentful/
function renderOptions(links) {
	// create an asset map
	const assetMap = new Map();
	// loop through the assets and add them to the map
	for (const asset of links.assets.block) {
		assetMap.set(asset.sys.id, asset);
	}

	return {
		// other options...
		renderNode: {
			[BLOCKS.EMBEDDED_ASSET]: (node, next) => {
				// find the asset in the assetMap by ID
				const asset = assetMap.get(node.data.target.sys.id);

				// render the asset accordingly
				return (
					<img src={asset.url} alt="My image alt text" />
				);
			},
		},
	};
}


export default function PostBody({ content }) {
	return (
		<div className='prose text-lg max-w-none'>
			{documentToReactComponents(content.json, renderOptions(content.links))}
		</div>
	);
}
