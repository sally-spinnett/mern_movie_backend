const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    email: {type: String, required: true},
    movieTitle: {type: String, required: true},
    marks: {type: Number, required: true},
});

module.exports = Rating = mongoose.model("ratings", ratingSchema);