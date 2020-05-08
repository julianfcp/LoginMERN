const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log("\npost verify: ");
    if(!token) {
        //return res.status(401).send('Access denied');
        return res.json({success: false, message:"Access denied"});
    }
    try {
        // verify the jwt token with the secret key
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log("verified: ");
        console.log(verified)
        next(); // middleware continues...
    } catch (err) {
        console.log("catch error: "+err);
        res.status(400).send('Invalid Token');
    }
}

module.exports = auth;