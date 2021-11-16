const POST_GRAPHQL_FIELDS = `
slug
title
coverImage {
  url
}
date
author {
  name
  picture {
    url
  }
}
excerpt
content {
  json
}
`;

const PLAYER_GRAPHQL_FIELDS = `
fullName
nickName
avtaPoint
userId
homeClub
coverImage {
  url
}
`;

const COMPETITION_GRAPHQL_FIELDS_HOME = `
  title
  slug
  excerpt
  date
  maxPoint
  club
  active
  type
  applicationGForm
  heroImage {
    url
  }
  teamsCollection(preview: false) {
    items {
      name
    }
  }
`;

const COMPETITION_GRAPHQL_FIELDS = `
title
slug
excerpt
description {
  json
}
date
maxPoint
club
active
applicationGForm
type
googleForm
resultSheets
rankingSheet
type
heroImage {
  url
}
teamsCollection(preview: false) {
  items {
    sys {
      id
    }
  }
}
`;

const TEAM_GRAPHQL_FIELDS = `
name
sys { id }
playersCollection(preview: false) {
  items {
    sys { id }
    fullName
    nickName
    avtaPoint
  }
}
`;

async function fetchGraphQL(query, preview = false) {
	return fetch(
		`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${
					preview
						? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
						: process.env.CONTENTFUL_ACCESS_TOKEN
				}`,
			},
			body: JSON.stringify({ query }),
		}
	).then((response) => response.json());
}

function extractPost(fetchResponse) {
	return fetchResponse?.data?.postCollection?.items?.[0];
}

function extractPostEntries(fetchResponse) {
	return fetchResponse?.data?.postCollection?.items;
}

function extractPlayerEntries(fetchResponse) {
	return fetchResponse?.data?.playerCollection?.items;
}

function extractPlayer(fetchResponse) {
	return fetchResponse?.data?.playerCollection?.items?.[0];
}

function extractCompetitionsEntries(fetchResponse) {
	return fetchResponse?.data?.competitionCollection?.items;
}

function extractTeamsEntries(fetchResponse) {
	return fetchResponse?.data?.teamCollection?.items;
}

function extractCompetition(fetchResponse) {
	return fetchResponse?.data?.competitionCollection?.items?.[0];
}

export async function getPreviewPostBySlug(slug) {
	const entry = await fetchGraphQL(
		`query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
		true
	);
	return extractPost(entry);
}

export async function getAllPostsWithSlug() {
	const entries = await fetchGraphQL(
		`query {
      postCollection(where: { slug_exists: true }, order: date_DESC) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
	);
	return extractPostEntries(entries);
}

export async function getTop10Players(preview) {
	const entries = await fetchGraphQL(
		`query {
      playerCollection(order: avtaPoint_DESC, preview: ${
			preview ? 'true' : 'false'
		}, limit: 10) {
        items {
          ${PLAYER_GRAPHQL_FIELDS}
        }
      }
    }`
	);
	return extractPlayerEntries(entries);
}

export async function getAllPlayers(preview) {
	const entries = await fetchGraphQL(
		`query {
      playerCollection(order: avtaPoint_DESC, preview: ${
			preview ? 'true' : 'false'
		}) {
        items {
          ${PLAYER_GRAPHQL_FIELDS}
        }
      }
    }`
	);
	return extractPlayerEntries(entries);
}

export async function getPlayerByNickName(nickName, preview) {
	const entries = await fetchGraphQL(
		`query {
      playerCollection(where: { nickName: "${nickName}" }, preview: ${
			preview ? 'true' : 'false'
		}) {
        items {
          ${PLAYER_GRAPHQL_FIELDS}
        }
      }
    }`
	);
	return extractPlayer(entries);
}

export async function getAllCompetitionsForHome(preview) {
	const entries = await fetchGraphQL(
		`query {
      competitionCollection(order: date_DESC, preview: ${
			preview ? 'true' : 'false'
		}) {
        items {
          ${COMPETITION_GRAPHQL_FIELDS_HOME}
        }
      }
    }`
	);
	return extractCompetitionsEntries(entries);
}

export async function getCompetitionBySlug(slug, preview) {
	let entries = await fetchGraphQL(
		`query {
      competitionCollection(where: { slug: "${slug}" }, preview: ${
			preview ? 'true' : 'false'
		}) {
        items {
          ${COMPETITION_GRAPHQL_FIELDS}
        }
      }
    }`
	);

	let competition = extractCompetition(entries);

	entries = await fetchGraphQL(
		`query {
      competitionCollection(where: { slug: "${slug}" }, preview: ${
			preview ? 'true' : 'false'
		}) {
        items {
          mediaCollection(preview: false) {
            items {
              url
            }
          }
        }
      }
    }`
	);

	competition = {
		...competition,
		...extractCompetition(entries),
	};

	// get each Team information
	const teamIdsquery = competition.teamsCollection.items
		.map((x) => `{ sys: { id : "${x.sys.id}"} }`)
		.join(',\n');

	entries = await fetchGraphQL(
		`query {
      teamCollection(where: {
        OR: [
          ${teamIdsquery}
        ]
       }, preview: ${preview ? 'true' : 'false'}) {
        items {
          name
          playersCollection(preview: false) {
            items {
              sys { id }
              fullName
              nickName
              avtaPoint
              userId
              homeClub
            }
          }
        }
      }
    }`
	);

	const teams = extractTeamsEntries(entries);

	competition = {
		...competition,
		teams,
	};

	return competition;
}

export async function getAllPostsForHome(preview) {
	const entries = await fetchGraphQL(
		`query {
      postCollection(order: date_DESC, preview: ${
			preview ? 'true' : 'false'
		}, limit: 5) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
		preview
	);
	return extractPostEntries(entries);
}

export async function getPostAndMorePosts(slug, preview) {
	const entry = await fetchGraphQL(
		`query {
      postCollection(where: { slug: "${slug}" }, preview: ${
			preview ? 'true' : 'false'
		}, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
		preview
	);
	const entries = await fetchGraphQL(
		`query {
      postCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
			preview ? 'true' : 'false'
		}, limit: 5) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
		preview
	);

	return {
		post: extractPost(entry),
		morePosts: extractPostEntries(entries),
	};
}
