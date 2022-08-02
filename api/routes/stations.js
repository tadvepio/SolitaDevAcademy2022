var express = require('express');
var router = express.Router();
var Station = require('../models/station');
var paginatedResults = require('../middleware/paginatedResults');

/* GET users listing. */
router.get('/', paginatedResults(Station), (req, res) => {
    res.json(res.paginatedResults);
});

module.exports = router;