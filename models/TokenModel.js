const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String, 
    unique : true 
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
