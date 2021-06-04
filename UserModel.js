const mongoose = require("mongoose");

const User = mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    age : {
        type : Number,
        require : true
    },
    likes : {
        type : [String],
    },
})

const model = mongoose.model("user" , User);
module.exports = model;