// Joi validation
const Joi = require('@hapi/joi');

const registerValdation = (data) => {
    const valUserSchema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        conf_password: Joi.string().min(6).required()
    });
    
   return valUserSchema.validate(data).error;
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    
   return schema.validate(data).error;
}


module.exports.registerValdation = registerValdation;
module.exports.loginValidation = loginValidation;