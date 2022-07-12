//Third Party Modules
const multer = require("multer");
const path = require("path"); 
const fs = require('fs'); 
const joi = require('joi'); 

//Models
const Place = require("../models/PlacesModel.js");
const City = require("../models/CityModel.js");

//Services
const CustomErrorHandler = require("../services/CustomErrorHandler.js");  
const CustomValidator = require("../services/CustomValidator.js");

//Where to upload files
const storage = multer.diskStorage({
  //uploads is the folder where all the files would be uploaded
  destination: (req, file, cb) => cb(null, "uploads/"),
  //what would be the filename
  filename: (req, file, cb) => {
    //Date on which file is created - random number - extension
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

//Handling multipart form data
const handleMultiPartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image"); //image is the field's key

const PlacesController = {
  //addplaces controller
  addPlaces: async (req, res, next) => {
    //we'll handle multipart form data
    handleMultiPartData(req, res, async (err) => {
      if (err) {
        return next(err);
      } 
      //path of file
      const filePath = req.file.path; 

      const placesSchema = joi.object({
       place_name : joi.string().required().custom(CustomValidator.placeNameValidation, "place_name must contain only alphanumeric charecters"), 
       city_name : joi.string().required(),
       place_pincode : joi.string().required().custom(CustomValidator.pincodeValidation, "not a valid pincode"), 
       place_rating : joi.number().min(0).max(5),
       place_latitude: joi.number().required(),
       place_longitude: joi.number().required(),
      });
      
      const { error } = placesSchema.validate(req.body); 

      if (error) {   
         //!if some error occurs we have to delete image from the server
         fs.unlink(`${appRoot}/${filePath}`, (err) => {
          return next(error);
        });
        return next(CustomErrorHandler.validationError(error.message));
      } 

      let place; 

      try {
        //find city of place
        const city_name = req.body.city_name;
        //Every city has a place and we have a different city model
        const cityFound = await City.findOne({ city_name: city_name });
        //if city doesn't exist then they have violated refrential integrity constraints
        if (!cityFound) {
          return next(
            CustomErrorHandler.cityNotFound("City not found in Database")
          );
        }

        const placeFound = await Place.exists({place_name : req.body.place_name});  
        const pinFound = await Place.exists({place_pincode : req.body.place_pincode});   
        const latittudeFound = await Place.exists({place_latitude : req.body.place_latitude});   
        const longitudeFound = await Place.exists({place_longitude : req.body.place_longitude}); 
         
        //!same co-ordinate check (very important)
        if (latittudeFound && longitudeFound && latittudeFound.place_name === longitudeFound.place_name) { 
          return next (CustomErrorHandler.alreadyExisits('co-ordinate already exists'))
        } 

        //No duplicate places allowed
        if (placeFound) { 
          return next(CustomErrorHandler.alreadyExisits('place already exisits in databse'));
        } 
        if (pinFound) { 
          return next(CustomErrorHandler.alreadyExisits('pin already exisits in databse'));
        } 


        place = await Place.create({
          place_id: req.body.place_id,
          place_name: req.body.place_name,
          city_name: req.body.city_name, //!city_name is primay key of city model and here it is the foreign key
          place_pincode: req.body.place_pincode,
          place_rating: req.body.place_rating,
          place_latitude: req.body.place_latitude,
          place_longitude: req.body.place_longitude,
          image: filePath, //!path of image
        }); 

      } catch (error) {
        //!if some error occurs we have to delete image from the server
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          return next(error);
        });
        return next(error);
      }
      res.status(201).json(place);
    });
  },
};

module.exports = PlacesController;

