const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    username: {type: String},
});

module.exports = Account = mongoose.model("accounts", accountSchema);
