//for dotenv file
const dotenv = require('dotenv'); 
dotenv.config(); 

//expressjs specific code
const express = require('express');  
const app = express();    

//using urlencoded data
app.use(express.urlencoded({extended : false}));
//To get req in JSON form
app.use(express.json());  // create a plan

//routings
const routes = require('./routes/routes.js');   
app.use(routes);    

//middlewares  
const ErrorHandler = require('./middlewares/ErrorHandler.js');  
app.use(ErrorHandler);   

//Database Connection
const mongoose = require('mongoose'); 

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
});  

//For Serving static files
app.use('/uploads', express.static('uploads')); 

//global variable path
const { dirname } = require('path');
global.appRoot = dirname(require.main.filename);


//Database Connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});  

//Server running at port
const port = process.env.PORT;   
app.listen(port);
