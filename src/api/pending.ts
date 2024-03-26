import axios from 'axios';

export const satoriPendinghandler = async () => {
  const sessionToken = process.env.NEXT_PUBLIC_SESSION_TOKEN as string;
  try {
    const apiResponse = await axios.get(
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
};

export const satoriReviewhandler = async () => {
  const sessionToken = process.env.NEXT_PUBLIC_SESSION_TOKEN as string;
  const reviewEndPoint =
    'https://www.satorireader.com/api/studylist/due?skip=0&take=20';
  try {
    const apiResponse = await axios.get(reviewEndPoint, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `SessionToken=${sessionToken}`,
      },
    });

    return apiResponse.data.result;
  } catch (error) {
    console.error('## Error fetching data:', error);
  }
};
