const fs = require('fs').promises;
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { submissionId } = JSON.parse(event.body);
    const readedPath = path.join(__dirname, '../../readed.json');
    let readedIds = [];
    
    try {
      readedIds = JSON.parse(await fs.readFile(readedPath));
    } catch {
      // File doesn't exist yet
    }

    if (!readedIds.includes(submissionId)) {
      readedIds.push(submissionId);
      await fs.writeFile(readedPath, JSON.stringify(readedIds, null, 2));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Marked as readed' })
    };
  } catch (error) {
    console.error('Error marking as readed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};