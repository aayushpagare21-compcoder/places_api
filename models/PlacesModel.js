const mongoose = require("mongoose");

const AutoIncrement = require("mongoose-sequence")(mongoose);
const CustomValidator = require("../services/CustomValidator.js");

const placeSchema = mongoose.Schema(
  {
    place_id: {
      type: Number,
      unique: true,
    },

    place_name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: CustomValidator.placeNameValidation,
        message: "Place name must be alphanumeric",
      },
    },

    //!foreign key city_name from model city :
    city_name: {
      type: String,
      required : true
    },

    place_pincode: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: CustomValidator.pincodeValidation,
        message: "Please enter correct pincode",
      },
    },
    place_latitude: {
      type: mongoose.Types.Decimal128,
      required : true
    },
    place_longitude: {
      type: mongoose.Types.Decimal128, 
      required : true
    },

    image: {
      type: String,
    },
  },
  { timestamps: true }
);

placeSchema.plugin(AutoIncrement, { id: "place_seq", inc_field: "place_id" });

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
