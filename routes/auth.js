const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValdation, loginValidation } = require('../validation');

// REGISTER

router.post('/register', async (req, res) => {
    const { name, email, password, conf_password } = req.body; // destructuring de los datos que vienen
    const newUser = new User({
        name,
        email,
        password,
    });
    const errors = [];
    const userExist = await User.findOne({email});
   
    // validation
    const val_error = registerValdation(req.body);

    // check if confirmation password is different
    if (password != conf_password) {
        errors.push({success: false, message: 'Passwords do not match  '});
    }
    // check errors with joi
    if (val_error){
        errors.push({success: false, message: val_error.details[0].message});
    }
    // check if user already exist
    if (userExist) {
        errors.push({success: false, message: 'User already exists '});
    } 

    if (errors.length > 0) {
        console.log(errors)
        res.json(errors);
    } else {
        newUser.password = await newUser.encryptPassword(password); // encrypta el password
        await newUser.save(); // se guarda el usuario
        console.log(newUser); 
        res.json({success: true, message: 'User Created '});
    }
});


// LOGIN

router.post('/login', async (req, res) => {
    const { email, password } = req.body; // destructuring de los datos que vienen
    const errors = [];
    // validation
    const val_error = loginValidation(req.body);
    const user = await User.findOne({email});
    
    // check errors with joi
    if (val_error){
        errors.push({success: false, message: val_error.details[0].message});
    }
    // check if user exists
    if (!user) {
        errors.push({success: false, message: 'Email or password is wrong'});
    } else {
        // check is password is wrong
        const validPass = await bcrypt.compare(password, user.password);    
        if(!validPass) {
            errors.push({success: false, message: 'Invalid password!'});
        }
    }
    
    if (errors.length > 0) {
        res.json(errors);
    } else {
        // Create Token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
        //res.json({success: true, message: 'Logged in! '});
    }

});





module.exports = router;