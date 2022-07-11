//For Custom Errors
class CustomErrorHandler extends Error { 
    constructor (status, message) { 
        super(); 
        this.status = status, 
        this.message = message
    } 

    //If user already exists then
    static alreadyExisits(message) { 
        return new CustomErrorHandler(409, message);
    } 

    //If Validation error then
    static validationError(message) { 
        return new CustomErrorHandler(442, message);
    } 

    //If invalid credentials  
    static invalidCredentials(message) {
        return new CustomErrorHandler(401, message);
      }  

    //If unatuhorized user 
    static unauthorizedUser(message) {  
        console.log('inswide');
        return new CustomErrorHandler(301, message);
    }
    
} 

module.exports = CustomErrorHandler;