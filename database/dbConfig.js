const { MongoClient } = require("mongodb");

const dbName = "parser-db";
const collectionName = "parser-coll";

let client = null;

async function connectDB() {
  try {
    if (client) {
      return client.db(dbName).collection(collectionName);
    }
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("Connected to the database");
    return client.db(dbName).collection(collectionName);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

// Export the collection for use in other files
module.exports = connectDB;
