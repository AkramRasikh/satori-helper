import axios from 'axios';

export default async function satoriPendinghandler() {
  const sessionToken = process.env.NEXT_PUBLIC_SESSION_TOKEN as string;
  try {
    const apiResponse = await axios.get(
      // 'https://www.satorireader.com/api/studylist/active?order=WhenDueAscending',
      // 'https://www.satorireader.com/api/studylist/active?skip=0&take=10&order=WhenDueAscending',
      'https://www.satorireader.com/api/studylist/due-and-pending-auto-importable?skip=0&take=20',
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `SessionToken=${sessionToken}`,
        },
      },
    );

    return apiResponse.data.result;
  } catch (error) {
    console.error('## Error fetching data:', error);
  }
}
