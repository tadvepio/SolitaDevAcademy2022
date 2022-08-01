// Import all necessary modules
const express = require('express');
const mongoose = require('mongoose');
const csv = require('fast-csv');
const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/.env'});
const fastcsv = require("fast-csv");
const fs = require('fs');
const journey = require("./models/journey.js");
const station = require("./models/station.js");

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
    let count = 0
    let discard = 0
    // stream the csv file through fs
    let stream = fs.createReadStream("journeydata.csv")
    let csvData = [];
    let csvStream = fastcsv
    // headers: true removes the first line of csv and ignoreEmpty ignores empty lines
    .parse({ headers: true, ignoreEmpty: true })
    // Discard rows that do not meet the requirements
    .validate( data => parseInt(data['Duration (sec.)']) >= 10 && parseInt(data['Covered distance (m)']) >= 10)
    .on("data", async function(data) {
        ++count
            csvData.push({
                ... data
            });
    // To keep node from boiling over, the maximum simultaneous processess is 1000.
    // After the count reaches maximum, pause the stream, send the rows to mongo as separate documents
    // and resume to stream after sending is done. 
        if (count >= 1000){
            csvStream.pause();
            await journey.insertMany(csvData)
            csvData = [];
            count = 0;
            csvStream.resume();
        }
    })
    // data-invalid is invoked when validation does not pass
    .on('data-invalid', () => ++discard)
    // .on('error') is invoked if there is a mismatch of columns between headers and rows
    .on('error', function(err) {
        console.log(err)
    })
    .on("end", async (rowCount) => {
        // Send rest of the rows to mongo
        await journey.insertMany(csvData);
        csvData = [];
        console.log("All done.\nAdded "+(rowCount-discard)+" documents to mongo and discarded: "+discard+" rows.")
        // Close mongo connection and express
        database.close()
        server.close()
    });
// Pipe the fs stream to fastcsv
stream.pipe(csvStream);
})

