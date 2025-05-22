const fs = require("fs").promises;
const path = require("path");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const filePath = path.join(__dirname, "../../submissions.json");
    let submissions = [];

    try {
      const fileData = await fs.readFile(filePath, "utf8");
      submissions = JSON.parse(fileData);
    } catch {}

    const newSubmission = { id: Date.now().toString(), ...data };
    submissions.push(newSubmission);

    await fs.writeFile(filePath, JSON.stringify(submissions, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Submission saved" })
    };
  } catch (err) {
    return { statusCode: 500, body: "Server error" };
  }
};
