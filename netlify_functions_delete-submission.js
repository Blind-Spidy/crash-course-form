const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { submissionId } = JSON.parse(event.body);
    const response = await fetch(`https://api.netlify.com/api/v1/submissions/${submissionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete submission');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Submission deleted' })
    };
  } catch (error) {
    console.error('Error deleting submission:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};