const router = require("express").Router();

const { getParsed } = require("../controllers/parserController");

router.get("/parse", getParsed);

module.exports = router;
