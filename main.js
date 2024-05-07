// Import required modules
require("dotenv").config();
const express = require("express");

const parserRoutes = require("./routes/parserRoutes");
const connectDB = require("./database/dbConfig");
const app = express();

const PORT = process.env.PORT | 3000;

app.use(parserRoutes);

async function main() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
