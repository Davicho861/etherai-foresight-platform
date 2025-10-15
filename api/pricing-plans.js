import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read the GLOBAL_OFFERING_PROTOCOL.json file
    const filePath = path.join(process.cwd(), 'GLOBAL_OFFERING_PROTOCOL.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error reading pricing data:', error);
    res.status(500).json({ error: 'Failed to load pricing data' });
  }
}