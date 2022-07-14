//dotenv
const dotenv = require("dotenv");
dotenv.config();

//third party libraries
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//models
const User = require("../models/UserModel.js");
const Token = require("../models/TokenModel.js");

//services
const CustomErrorHandler = require("../services/CustomErrorHandler.js");

const LoginController = {
  //Schema Validation
  login: async (req, res, next) => {
    const loginSchema = joi.object({
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      //! Validation error
      return next(CustomErrorHandler.validationError(error.message));
    }


    try {
      //Checl if user has already registered or not
      const findUser = await User.findOne({ email: req.body.email });
      if (!findUser) {
        // ! User has not registered
        return next(
          CustomErrorHandler.invalidCredentials("User hasn't registered")
        );
      } else {
        //If user has registered check if passwords match
        const match = await bcrypt.compare(
          req.body.password,
          findUser.password
        );

        if (!match) {
          //! Passwords don't match
          return next(
            CustomErrorHandler.invalidCredentials("Passwords dont match")
          );
        } else {
          //* Generate token for authenticated user
          const token = jwt.sign(
            {
              _id: findUser._id,
            },
            process.env.SECRET_KEY
          );

          //* Saving token in databse
          const savedToken = Token.create({ token: token });
        
          res.status(200).json({ token: token });
        }
      }
    } catch (error) {
      return next(error);
    }
  },

  async logout(req, res, next) {
    //* token sent with authorization header
    let authHeader = req.headers.authorization;

    //! if authorization header is not present
    if (!authHeader) {
      return next(CustomErrorHandler.unauthorizedUser("Please Login First"));
    }

    const token = authHeader.split(" ")[1].trim();  
    
    try {
        const deletedToken = await Token.findOneAndDelete({token : token});
        console.log(deletedToken);
        if (deletedToken) { 
            res.status(200).json({"message" : "logged out"})
        } else { 
          return CustomErrorHandler.unauthorizedUser("Please login first");
        }
    } catch (error) {
        return next(error);
    }  
  },
};

module.exports = LoginController;
