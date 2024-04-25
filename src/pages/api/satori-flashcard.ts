import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { cardId, flashCardNumber } = req.body;

  const sessionToken = process.env.NEXT_PUBLIC_SESSION_TOKEN as string;

  const headers = {
    Cookie: `SessionToken=${sessionToken}`,
    Referer: 'https://www.satorireader.com/review/srs?filter=due', // check without
  };

  const url = `https://www.satorireader.com/api/studylist/${cardId}?q=${flashCardNumber}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const resText = JSON.parse(await response.text());

    if (resText.success) {
      res.status(200).end();
    }
  } catch (error) {
    console.error('## Error fetching data:', error);
    throw error;
  }
}
