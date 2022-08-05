var express = require('express');
var router = express.Router();
var Station = require('../models/station');

/* GET station recommendations. */
router.post('/', async (req, res) => {
    const string = req.body.value.charAt(0).toUpperCase() + req.body.value.slice(1)
    const regexp = new RegExp("^"+string)
    const recommendations = await Station.find({Nimi: regexp }).select('Nimi')
    res.results = recommendations
    res.json(res.results)
});

module.exports = router;