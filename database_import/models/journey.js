const mongoose = require("mongoose");

const journeySchema = mongoose.Schema({
    Departure: {
        type: String,
        default: undefined
    },
    Return: {
        type: String,
        default: undefined
    },
    "Departure station id": {
        type: Number,
        default: undefined
    },
    "Departure station name": {
        type: String,
        default: undefined
    },
    "Return station id": {
        type: Number,
        default: undefined
    },
    "Return station name": {
        type: String,
        default: undefined
    },
    "Covered distance (m)": {
        type: Number,
        default: undefined
    },
    "Duration (sec.)": {
        type: Number,
        default: undefined
    }
})

module.exports = mongoose.model("journey", journeySchema)