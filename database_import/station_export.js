const express = require('express');
const mongoose = require('mongoose');
const csv = require('fast-csv');
const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/.env'});
const fastcsv = require("fast-csv");
const fs = require('fs');
const station = require("./models/station.js");

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
    let stream = fs.createReadStream("Helsingin_ja_Espoon_kaupunkipy%C3%B6r%C3%A4asemat_avoin (1).csv")
    let csvData = [];
    let csvStream = fastcsv
    .parse({ headers: true, ignoreEmpty: true })
    .on("data", async function(data) {
            csvData.push({
                ... data
            });
        }
    )
    .on('error', function(err) {
        console.log(err)
    })
    .on("end", async (rowCount) => {
        await station.insertMany(csvData);
        csvData = [];
        console.log("All done.\nAdded "+(rowCount)+" documents to mongo.")
    });

stream.pipe(csvStream);
})

