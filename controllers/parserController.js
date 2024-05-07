const { startExtraction } = require("../utils/utils");
const connectDB = require("../database/dbConfig");

const getParsed = async (req, res) => {
  // URL of the API endpoint
  const apiUrl =
    "https://www.ecfr.gov/api/renderer/v1/content/enhanced/2024-03-01/title-2";
  let collection = await connectDB();

  let result = await collection.findOne();

  if (!result) {
    result = await startExtraction(apiUrl);
    await collection.insertOne(result);
  }

  res.json({ parsedHtml: result });
};

module.exports = { getParsed };
