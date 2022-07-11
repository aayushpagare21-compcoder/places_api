//for dotenv file
const dotenv = require('dotenv'); 
dotenv.config(); 

//expressjs specific code
const express = require('express');  
const app = express();    

//using urlencoded data
app.use(express.urlencoded({extended : false}));
//To get req in JSON form
app.use(express.json());  

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
    useUnifiedTopology: true
}); 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});  

// console.log('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmNiYmIxN2E0MjRmMjZjMWUzNzEwMmMiLCJpYXQiOjE2NTc1MTg4NzF9.6tEa2Ke4KtMtHWLp4gm0L8Qm-sNEBXoWKHVZ8CgQrew' === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmNiYmIzNGE0MjRmMjZjMWUzNzEwMzEiLCJpYXQiOjE2NTc1NDIxMTF9.D8LY02mSJ-QYo6lWXE0dCl0gtZ8nGNyUdabIdj0nhUo');

//server running at 
const port = process.env.PORT;   

app.listen(port);