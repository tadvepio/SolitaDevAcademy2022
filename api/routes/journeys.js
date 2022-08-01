var express = require('express');
var router = express.Router();
var Journey = require('../models/journey');

/* GET users listing. */
router.get('/', async (req, res, next) => {
    try {
        const journeys = await Journey.find({'Departure':"2021-05-31T23:57:25",'Return':"2021-06-01T00:05:46"});
        res.send(journeys);
        
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;