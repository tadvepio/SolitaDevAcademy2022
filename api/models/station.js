const mongoose = require("mongoose");

// Mongoose model for bike station
// The attributes need to be identical to the headers on the csv files

const stationSchema = mongoose.Schema({
    FID: {
        type: Number,
        required: true
    },
    ID: {
        type: Number,
        required: true
    },
    Nimi: {
        type: String,
        required: true
    },
    Namn: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Osoite: {
        type: String,
        required: true
    },
    Adress: {
        type: String,
        required: true
    },
    Kaupunki: {
        type: String,
        required: true
    },
    Stad: {
        type: String,
        required: true
    },
    Operaattor: {
        type: String,
        required: true
    },
    Kapasiteet: {
        type: Number,
        required: true
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("station", stationSchema)