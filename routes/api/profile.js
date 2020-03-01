const express  = require ('express');
const router =  express.Router();
const auth = require ('../../middleware/auth');
const Profile = require ('../../models/Profile');
const User = require ('../../models/User');

const { check, validationResult } = require ('express-validator');

// @route GET api/profile/me
// @desc Get Current User Profile
// @access Private

router.get('/me',auth, async (req,res) => {
	try{

		const profile = await Profile.findOne({user: req.user.id}).populate('User',[
			'name','avatar']);

		if (!profile){
			return res.status (400).json({ msg:'There is no profile for this user'});

		}

		res.json(profile);


	}
	catch(err){

		console.error(err.message);
		res.status(500).json({msg:'Server Error'});
	}

});




// @route POST api/profile/
// @desc Create or update a user profile
// @access Private

router.post('/',[auth, [
	check('status', 'status is required')
	.not()
	.isEmpty(),
	check('skills','skills is required')
	.not()
	.isEmpty()
	] ], 
	async (req,res)=> {

		const errors = validationResult(req);

		if (!errors.isEmpty()){

			return res.status(400).json({errors: errors.array()})
		}




		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin
		} = req.body;

		//Build profile object

		const profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;

		if (skills){
			profileFields.skills = skills.split(',').map(skills => skills.trim());

		}

		//Build social Object

		profileFields.social={}

		if (youtube) profileFields.social.youtube = youtube;
		if (twitter) profileFields.social.twitter = twitter;
		if (linkedin) profileFields.social.linkedin = linkedin;
		if (facebook) profileFields.social.facebook = facebook;
		if (instagram) profileFields.social.instagram = instagram;


		try{

			let profile = await Profile.findOne ({user: req.user.id});

			if (profile){
				//update

				profile = await findOneAndUpdate({user: req.user.id},
												{$set, profileFields},
												{new: true });

				return res.json(profile);
			}

			profile = new Profile(profileFields);

			await profile.save();
			return res.json(profile);
		}
		catch (err){
			console.error(err);
			res.status(500).send('Server Error')
		}



	})

module.exports = router;