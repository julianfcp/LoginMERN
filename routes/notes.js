const router = require('express').Router();
const verify = require('./verifyToken');


router.get('/', verify, (req, res) => {
    res.json({
        note: {
            title: "Note title",
            content: "Note Content",
            user: req.user
        }
    });
});


module.exports = router;