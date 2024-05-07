import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body; // Assuming you're sending data in the request body

    // Path to your JSON file
    const filePath = path.join(process.cwd(), 'src', 'pages', 'content.json');

    // Read existing data from the file
    let existingData = [];
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContents);
    } catch (error) {
      console.error('Error reading file:', error);
    }

    // Update existing data with new data
    existingData.push(...data);

    // Write updated data back to the file
    try {
      fs.writeFileSync(filePath, JSON.stringify(existingData));
      res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error writing file:', error);
      res.status(500).json({ message: 'Error saving data' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
