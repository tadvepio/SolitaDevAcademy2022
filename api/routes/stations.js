var express = require('express');
var router = express.Router();
var Station = require('../models/station');
var Journey = require('../models/journey');
var paginatedResults = require('../middleware/paginatedResults');

/* GET station listing. */
router.get('/', paginatedResults(Station),  (req, res) => {
    res.json(res.paginatedResults);
});

module.exports = router;