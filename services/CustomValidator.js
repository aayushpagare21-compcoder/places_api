const CustomValidator = {  
    //for only alphanumeric charecters
    placeNameValidation(str) {  
        return new RegExp('^[a-zA-Z0-9]+$').test(str);
    }, 

    pincodeValidation(str) { 
        return new RegExp('^[0-9]{6}$').test(str);
    }
} 

module.exports = CustomValidator;