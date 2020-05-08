const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValdation, loginValidation } = require('../utilities/validation');

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password, conf_password } = req.body; // destructuring de los datos que vienen
    const newUser = new User({
        name,
        email,
        password,
    });
    console.log(newUser);
    const errors = [];
    const userExist = await User.findOne({email});
   
    // validation
    const val_error = registerValdation(req.body);
    
    // check if user already exist
    if (userExist) {
        errors.push({success: false, message: 'User already exists '});
    } 
    // check if confirmation password is different
    if (password != conf_password) {
        errors.push({success: false, message: 'Passwords do not match  '});
    }
    // check errors with joi
    if (val_error){
        errors.push({success: false, message: val_error.details[0].message});
    }

    if (errors.length > 0) {
        console.log(errors)
        res.json(errors[0]);
    } else {
        newUser.password = await newUser.encryptPassword(password); // encrypta el password
        await newUser.save(); // se guarda el usuario
        console.log(newUser); 
        res.json({success: true, message: 'User Created '});
    }
});


// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // destructuring of the body object
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
    // if there are errors the system sends a response
    if (errors.length > 0) {
        res.json(errors[0]);
    } else { // No errors
        // Create Token
        const token = await jwt.sign(
            {_id: user._id}, 
            process.env.TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        // Set a cookie with httpOnly so the front end couldn not manipulate it
        res.cookie("access_token", token, {
            httpOnly: true,
            //maxAge: 3600,
            secure: false});
        res.header('access_token', token);
        res.status(200);
        res.json({success: true, message: 'Logged In!', token: token})
        //res.send();
    }
    console.log(req.cookies);

});


router.post('/logout', async (req, res) => {
    token = req.cookies.access_token;
    if(!token){
        res.json({success: false, message: 'No user logged in'});
    } else {
        res.cookie('access_token', '');
        res.header('access_token', token);
        res.status(200);
        res.json({success: true, message: 'User logged out'});
    }
 });


module.exports = router;