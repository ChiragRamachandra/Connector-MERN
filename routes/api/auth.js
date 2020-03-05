const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User')

// @route GET api/auth
// @desc Test Route
// @access Public

router.get('/', auth, async(req, res) => {

    try {
        //console.log('inside the try block');
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

        // console.log('done with fetch');
    } catch (err) {

        console.log(err.message);
        res.status(500).send('Server Error');

    }
});

module.exports = router;