const express = require('express');
const mongoose = require('mongoose');
const csv = require('fast-csv');
const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/.env'});
const fastcsv = require("fast-csv");
const fs = require('fs');
const journey = require("./models/journey.js");

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
});

const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})
database.on('connected', ()=> {
    console.log("Database Connected");
    let count = 0
    let discard = 0
    let stream = fs.createReadStream("2021-07_filtered.csv")
    let csvData = [];
    let csvStream = fastcsv
    .parse({ headers: true, ignoreEmpty: true })
    .validate( data => parseInt(data['Duration (sec.)']) >= 10 && parseInt(data['Covered distance (m)']) >= 10)
    .on("data", async function(data) {
        ++count
            csvData.push({
                ... data
            });
        
        if (count >= 1000){
            csvStream.pause();
            await journey.insertMany(csvData)
            csvData = [];
            count = 0;
            csvStream.resume();
        }
    })
    .on('data-invalid', () => ++discard)
    .on('error', function(err) {
        console.log(err)
    })
    .on("end", async (rowCount) => {
        await journey.insertMany(csvData);
        csvData = [];
        console.log("All done.\nAdded "+(rowCount-discard)+" documents to mongo and discarded: "+discard+" rows.")
    });

stream.pipe(csvStream);
})

