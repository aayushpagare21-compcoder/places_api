//env file
const dotenv = require('dotenv');  
dotenv.config();  

//third part libraries
const joi = require("joi"); 
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 

//Models
const User = require("../models/UserModel"); 
const Token = require("../models/TokenModel.js");

//Services 
const CustomErrorHandler = require("../services/CustomErrorHandler.js"); 

const RegisterController = {
  register: async (req, res, next) => {
    //Validation of user's request
    const registerSchema = joi.object({
      name: joi.string().min(3).max(30).required(),
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
      //!Validation error
      return next(CustomErrorHandler.validationError(error.message));
    }

    //Check if user already exisits
    try {
      const userExists = await User.exists({ email: req.body.email });

      if (userExists) {
        //!user already registered
        return next(
          CustomErrorHandler.alreadyExisits("User has already registered")
        );
      } else {
        const pwd = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: pwd,
        });
        try { 
          //* Saving User in Database
          const savedUser = await newUser.save();

          if (savedUser) {
              
              //*Everytime a user is authenticated an access token is generated with a payload as user's id
              const accessToken = jwt.sign({ 
                _id : savedUser._id
              }, process.env.SECRET_KEY);  

            //*Saving Token in database 
            await Token.create({token : accessToken}); 

            res.status(201).json({'token' : accessToken});

          } else {
            //! Internal Server Error
            return next(error);
          }
        } catch (error) {  
          console.log(error.message);
          return next(error);
        }
      }
    } catch (error) {
      //!Internal server error
      return next(error);
    }
  },
};

module.exports = RegisterController;
