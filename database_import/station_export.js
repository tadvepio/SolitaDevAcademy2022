// Import all necessary modules
const express = require('express');
const mongoose = require('mongoose');
const csv = require('fast-csv');
const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/.env'});
const fastcsv = require("fast-csv");
const fs = require('fs');
const station = require("./models/station.js");
const { Server } = require('http');

// Set up an express server
const app = express();
app.use(express.json());
var server = app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
});

// Establish a connection to mongoDB
const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})
database.on('connected', ()=> {
    console.log("Database Connected");
    // After succesful connection, create variables and start the csv stream
    // stream the csv file through fs
    let stream = fs.createReadStream("station_data.csv")
    let csvData = [];
    let csvStream = fastcsv
    // headers: true removes the first line of csv and ignoreEmpty ignores empty lines
    .parse({ headers: true, ignoreEmpty: true })
    .on("data", function(data) {
            csvData.push({
                ... data
            });
        }
    )
    // .on('error') is invoked if there is a mismatch of columns between headers and rows
    .on('error', function(err) {
        console.log(err)
    })
    .on("end", async (rowCount) => {
        // Send data to mongo
        await station.insertMany(csvData);
        csvData = [];
        console.log("All done.\nAdded "+(rowCount)+" documents to mongo.")
        // Close mongo connection and express
        database.close()
        server.close()
    });

// Pipe the fs stream to fastcsv
stream.pipe(csvStream);
})

