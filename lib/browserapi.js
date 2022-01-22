const PLAYER_GRAPHQL_FIELDS = `
sys { id }
fullName
nickName
avtaPoint
userId
homeClub
mobileNumber
coverImage {
  url
}
`;

async function fetchGraphQL(query, preview = false) {
  const spaceId = '012zf22jz69j';
  const accesstoken = 'NzV4pmb3TPbXdLT0I3J6HTQ9lAl_URSiTcFyXIsv5OM';
  const previewtoken = 'rAs5ujisVYuwmzlPZJdmji4BBwPLL6d_R6Fg1vJ5eUY';
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${preview
          ? previewtoken
          : accesstoken
          }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json());
}

export async function getPlayerById(id, preview) {
  const entries = await fetchGraphQL(
    `query {
      playerCollection(where: { sys: { id: "${id}" } }, preview: ${preview ? 'true' : 'false'
    }) {
        items {
          ${PLAYER_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return entries?.data?.playerCollection?.items?.[0]
}