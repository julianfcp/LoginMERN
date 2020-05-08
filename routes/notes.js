const router = require('express').Router();
const verify = require('./verifyToken');


router.get('/', (req, res) => {
    console.log("get: ")
    console.log(req.cookies);
    res.json({
        note: {
            title: "Note title",
            content: "Note Content",
            user: req.user,
        }
    });
});

router.post('/', verify, (req, res) => {
    console.log("post: ")
    console.log(req.cookies);
    res.json({ success: true, message: "Logged In!",
        note: {
            title: "Note title",
            content: "Note Content",
            user: req.user,
        }
    });
});

module.exports = router;