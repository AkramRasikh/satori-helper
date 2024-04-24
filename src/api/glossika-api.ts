import axios from 'axios';

export const getAudioMP3 = (url) => {
  return (
    `${url}?` +
    `Expires=` +
    process.env.NEXT_PUBLIC_GLOSSIKA_SESSION_EXPIRES +
    `Signature=` +
    process.env.NEXT_PUBLIC_GLOSSIKA_SIGNATURE +
    'Key-Pair-Id=' +
    process.env.NEXT_PUBLIC_GLOSSIKA_KEY_PAIR_ID
  );
};

export default async function getGlossikaFavourites() {
  const sessionToken = process.env.NEXT_PUBLIC_GLOSSIKA_SESSION as string;

  try {
    const apiResponse = await axios.get(
      `https://ai.glossika.com/api/v2/records/list/c2e1815c-b066-4e3e-bf06-c6310e4d501e/collection/time_desc?page=1&per_page=20`,
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionToken,
        },
      },
    );

    console.log('## apiResponse.data: ', apiResponse.data);

    return apiResponse.data;
  } catch (error) {
    console.error('## Error fetching data:', error);
  }
}
// const map = {
//   sourceLangID: 22,
//   total_sentences: 992,
//   total_page: 20,
//   page_size: 50,
//   page_number: 1,
//   filter: 'collection',
//   sort: 'time_desc',
//   source_map: [
//     {
//       uuid: 'dc509f59-9df4-11e7-b3a3-d05099a7c6d0',
//       sentence_id: 6047,
//       latest_recall: 0.569,
//       updated_at: 1709109284,
//       text: 'いいえ、持ってい無いそうです。',
//       is_favorite: true,
//       is_easy: false,
//       in_my_list: [],
//     },
//   ];
// };
