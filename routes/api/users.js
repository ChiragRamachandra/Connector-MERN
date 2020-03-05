const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config')

const {
    check,
    validationResult
} = require('express-validator');

//Bringing the model
const User = require('../../models/User');

// @route POST api/users
// @desc Test Route
// @access Public

router.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is not valid').isEmail(),
        check('password', 'psasword is not valid').isLength({
            min: 6
        })
    ],

    async(req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }


        const {
            name,
            email,
            password
        } = req.body;

        try {

            //see if user exists
            let user = await User.findOne({
                email
            });

            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'User Already Exists'
                    }]
                });
            }

            // Get user gravatar

            const avatar = gravatar.url(email, {
                s: '200',
                pg: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });
            //Encrypt Password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            //To save/insert into the database
            await user.save();

            //Return  jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,
                config.get('jwtSecret'), {
                    expiresIn: 360000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json(token);
                });


        } catch (err) {

            console.error(err.message);
            res.status(500).send('Server Error');

        }



    });





router.post('/login', [
        check('email', 'Email is not valid').isEmail(),
        check('password', 'psasword is not valid').isLength({
            min: 6
        })
    ],
    async(req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }


        const {
            email,
            password
        } = req.body;



        try {

            //Find user by email
            const user = await User.findOne({
                email: email
            });
            if (!user) {
                return res.status(404).json({
                    msg: "user not found"
                })
            }

            // Check Password
            const isMatch = await bcrypt.compare(password, user.password);

            console.log(isMatch);

            if (isMatch) {

                const payload = {
                    user: {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar

                    }
                }


                jwt.sign(
                    payload,
                    config.get('jwtSecret'), {
                        expiresIn: 36000000
                    },
                    (err, token) => {
                        return res.json({

                            token: token
                        });
                    }
                );
            } else {
                return res.status(400).json({
                    msg: "Password Incorrect"
                });
            }
        } catch (err) {

            console.error(err.message);
            res.status(500).send('Server Error');
        }


    });


// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
// router.post('/login', (req, res) => {
//   // const { errors, isValid } = validateLoginInput(req.body);

//   // // Check Validation
//   // if (!isValid) {
//   //   return res.status(400).json(errors);
//   // }

//   console.log("req hitting");

//   const email = req.body.email;
//   const password = req.body.password;

//   // Find user by email
//   User.findOne({ email }).then(user => {
//     // Check for user
//     if (!user) {
//       errors.email = 'User not found';
//       return res.status(404).json(errors);
//     }

//     // Check Password
//     bcrypt.compare(password, user.password).then(isMatch => {
//       if (isMatch) {
//         // User Matched
//         const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

//         // Sign Token
//         jwt.sign(
//           payload,
//           keys.secretOrKey,
//           { expiresIn: 3600 },
//           (err, token) => {
//             res.json({
//               success: true,
//               token: 'Bearer ' + token
//             });
//           }
//         );
//       } else {
//         errors.password = 'Password incorrect';
//         return res.status(400).json(errors);
//       }
//     });
//   });
// });

module.exports = router;