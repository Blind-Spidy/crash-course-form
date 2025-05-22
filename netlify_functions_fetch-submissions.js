const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const sanitizeHtml = require('sanitize-html');

exports.handler = async function(event, context) {
  try {
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/forms/${process.env.NETLIFY_FORM_ID}/submissions`, {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch submissions');
    }
    
    const submissions = await response.json();
    const formattedSubmissions = submissions.map(sub => ({
      id: sub.id,
      studentName: sanitizeHtml(sub.data.studentName),
      schoolName: sanitizeHtml(sub.data.schoolName),
      course: sanitizeHtml(sub.data.course),
      failedSubjects: sanitizeHtml(sub.data.failedSubjects || ''),
      contactNumber: sanitizeHtml(sub.data.contactNumber)
    }));
    
    // Write to submissions.json in the public directory
    await fs.writeFile(path.join(__dirname, '../../submissions.json'), JSON.stringify(formattedSubmissions, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Submissions fetched and saved' })
    };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};