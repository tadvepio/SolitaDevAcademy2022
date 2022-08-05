var express = require('express');
var router = express.Router();
var Journey = require('../models/journey');

router.get('/', async (req,res) => {

    const station = req.query.station;

    const details = {}

    // Count the journeys starting and ending with a station
    departures = await Journey.find({'Departure station id':`${station}`});
    returns = await Journey.find({'Return station id':`${station}`});
    details.stationId = station
    details.numOfDep = departures.length;
    details.numOfRet = returns.length;

    // Count average distance covered both departure and return
    let distance = 0
    departures.map((item) => {
        distance += item['Covered distance (m)']
    })
    details.AvgDepDistance = distance/details.numOfDep

    distance = 0
    returns.map((item) => {
        distance += item['Covered distance (m)']
    })
    details.AvgRetDistance = distance/details.numOfRet

    res.stationDetails = details;

    // This function calculates the top5 departures and returns of a station
    function mostPopular(departures, string)  {
        returnStations = []
        returnCount1 = []
        returnCount = {}
        departures.map((item) => {
            returnStations.push(item[`${string}`])
        })
        for (const element of returnStations) {
            if (returnCount[element]) {
                returnCount[element] += 1
            } else {
                returnCount[element] = 1
            }
        }
        for (var stationss in returnCount) {
            returnCount1.push([stationss, returnCount[stationss]])
        }

        returnCount1.sort((a,b)=>{
            return a[1] - b[1]
        })
        var top5 = returnCount1.splice(-5)

        if (string === "Return station name") {
            res.stationDetails.mostPopularReturn = top5.slice(0).reverse();
        } else {
            res.stationDetails.mostPopularDeparture = top5.slice(0).reverse();
        }
        
    }

    mostPopular(departures, "Return station name");
    mostPopular(returns, "Departure station name");

    res.json(res.stationDetails)

    });


module.exports = router;