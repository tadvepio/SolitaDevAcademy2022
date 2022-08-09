var express = require('express');
var router = express.Router();
var addEntry = require('../middleware/addEntry')
var Journey = require('../models/journey');
var Station = require('../models/station');

router.post('/journey', addEntry(Journey), (req, res) => {
    console.log("Hi from router")
    res.json(res.msg)
})

router.post('/station', addEntry(Station), (req, res) => {
    res.json(res.msg)
})

module.exports = router