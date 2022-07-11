//dotenv
const dotenv = require("dotenv");
dotenv.config();

//third party libraries
const jwt = require("jsonwebtoken");

//Services
const CustomErrorHandler = require("../services/CustomErrorHandler");

//Models
const Token = require("../models/TokenModel");
const User = require("../models/UserModel.js");

async function auth(req, res, next) { 
  
 //* token sent with authorization header
  let authHeader = req.headers.authorization;

  //! if authorization header is not present
  if (!authHeader) {
    return next(CustomErrorHandler.unauthorizedUser("not authorized"));
  }

  const token = authHeader.split(" ")[1];
  console.log(token);

  try { 
    //* Verify Digital Signature
    const _id = jwt.verify(token, process.env.SECRET_KEY); 

    //* If user logs out token would be deleted 
    const tokenFound = await Token.findOne({ token: token });

     //! User has logged out
      if (!tokenFound) {
        return next(CustomErrorHandler.unauthorizedUser("you have been logged out"));
    }
    
  } catch (error) { 
    return next(CustomErrorHandler.unauthorizedUser("not authorized"));
  }

  next();
}

module.exports = auth;