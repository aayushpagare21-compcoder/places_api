//Express-Specific COde
const express = require('express'); 
const router = express.Router();  

//Controllers
const RegisterController = require('../controllers/RegisterContoller.js');
const LoginController = require('../controllers/LoginController.js') 

//Middlewares 
const auth = require('../middlewares/auth.js'); 

//Register API
router.post('/api/register', RegisterController.register); 

//Login API  
router.post('/api/login', LoginController.login); 

//Logout APi 
router.post('/api/logout', LoginController.logout);  

//Protected Route 
router.get('/api/protected', auth, (req, res) => { 
    console.log('hello'); 
    res.json({"message" : "ok"});
})

module.exports = router;