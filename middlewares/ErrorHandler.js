const CustomErrorHandler = require('../services/CustomErrorHandler'); 

function ErrorHandler(err, req, res, next) { 

    let statusCode = 500; 

    let data = { 
        message : 'Internal Server Error'
    } 

    if (err instanceof CustomErrorHandler) { 
        statusCode = err.status, 
        data = { 
            message : err.message
        }
    } 
    console.log('aaya');
    return res.status(statusCode).json(data);
} 

module.exports = ErrorHandler;