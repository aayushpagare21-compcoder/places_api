const mongoose = require("mongoose"); 

const citySchema = mongoose.Schema({ 
    city_name : {
        type : String, 
        unique : true, 
        required : true
    }
}); 

const City = mongoose.model('City', citySchema);  

module.exports = City;