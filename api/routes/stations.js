var express = require('express');
var router = express.Router();
var Station = require('../models/station');

/* GET users listing. */
router.get('/', async (req, res, next) => {
    try {
        const stations = await Station.find();
        res.send(stations);
        
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;