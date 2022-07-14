//Express-Specific COde
const express = require('express'); 
const router = express.Router();  

//Controllers
const RegisterController = require('../controllers/RegisterContoller.js');
const LoginController = require('../controllers/LoginController.js'); 
const PlacesController = require('../controllers/PlacesController.js'); 

//Middlewares : use auth middleware for protecting routes - 
const auth = require('../middlewares/auth.js'); 

//Register API
router.post('/api/register', RegisterController.register); 

//Login API  
router.post('/api/login', LoginController.login); 

//Logout APi 
router.post('/api/logout', LoginController.logout);  

//Protected Route example
router.get('/api/protected', auth, (req, res) => { 
    res.json({"message" : "ok"});
}) 

//Add places
router.post('/api/places', PlacesController.addPlaces);  

//Get Places 
router.get('/api/places', PlacesController.getPlaces);

module.exports = router;