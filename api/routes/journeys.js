var express = require('express');
var router = express.Router();
var Journey = require('../models/journey');
var paginatedResults = require('../middleware/paginatedResults');

/* GET journey listing. */
router.get('/', paginatedResults(Journey), (req, res) => {
    res.json(res.paginatedResults);
});

module.exports = router;