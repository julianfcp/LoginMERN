const router = require('express').Router();
const User = require('../model/User');
const { registerValdation } = require('../validation');



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



module.exports = router;