var mongoose = require('mongoose');
const express  = require ('express');
const router =  express.Router();
const auth = require ('../../middleware/auth');
const User = require ('../../models/User');
const Profile = require ('../../models/Profile');


const { check, validationResult } = require ('express-validator');

// @route GET api/profile/me
// @desc Get Current User Profile
// @access Private

router.get('/me',auth, async (req,res) => {
	try{

		const profile = await Profile.findOne({user: req.user.id}).populate('user',[
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



// @route GET api/profile
// @desc Get All Profiles
// @access Public

router.get('/', async(req,res) =>{

	try{

		const profile = await Profile.find().populate('user', ['name', 'avatar','email']);
		res.json(profile);

	}

	catch(err){
		console.error(err.message);
		res.status(500).send('Server Error');


	}


})


// @route GET api/profile/user/:user_id
// @desc Get Profile by user id
// @access Public

router.get('/user/:user_id', async(req,res) =>{

	try{

		const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);

		if(!profile){
			return res.status(400).json({msg:'Profile not found'});
		}

		res.json(profile);

	}

	catch(err){
		console.error(err.message);
		if (err.kind == 'ObjectId'){	
			return res.status(400).json({msg:'Profile not found'}); 

		}
		res.status(500).send('Server Error');


	}


})

// @route DELETE api/profile
// @desc DELETE Profile, User and Posts
// @access Private

router.delete('/',auth, async(req,res) =>{

	try{

		//@to-do : remove users posts



		//Remove Profile
		await Profile.findOneAndRemove({user: req.user.id});


		//Remove User
		await User.findOneAndRemove({_id: req.user.id});
		res.json({msg: 'User deleted successfully'});

	}

	catch(err){
		console.error(err.message);
		res.status(500).send('Server Error');


	}


});


// @route PUT api/profile/experience
// @desc Add profile experience
// @access Private

router.put('/experience', [ auth, [	
	check ('title', 'title is required')
	.not()
	.isEmpty(),
	check ('company', 'company is required')
	.not()
	.isEmpty(),
	check ('from', 'From date is required')
	.not()
	.isEmpty(),
	]], async (req,res) => {

		const errors = validationResult(req);
	 	if (!errors.isEmpty()){
	 		return res.status(400).json({errors: errors.array()});
	 	}

	 	//Copying the request into local constants
	 	const {
	 		title,
	 		company,
	 		location,
	 		from,
	 		to,
	 		current,
	 		description
	 	} = req.body;

	 	//Creating an object to be inserted
	 	const newExp = {
	 		title,
	 		company,
	 		location,
	 		from,
	 		to,
	 		current,
	 		description
	 	}

	 	try{
 
	 		//To place it inside the right profile
	 		const profile = await Profile.findOne({user: req.user.id});

	 		profile.experience.unshift(newExp);
	 		await profile.save();

	 		return res.json(profile);


	 	}

	 	catch(err){
	 		console.error(err.message);
	 		return res.status(500).send('Server Error');

	 	}


});

// @route DELET api/profile/experience/:exp_id
// @desc Delete profile experience
// @access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {

try{

	const profile = await Profile.findOne({user: req.user.id});

	//Get the remove index
	const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

	profile.experience.splice(removeIndex,1);
	await profile.save();

	res.json(profile);

}
catch (err){
	console.error(err.message);
	res.status(500).send('Server Error');

}

})



// @route PUT api/profile/education
// @desc Add profile education
// @access Private

router.put('/education', [ auth, [	
	check ('school', 'school is required')
	.not()
	.isEmpty(),
	check ('degree', 'degree is required')
	.not()
	.isEmpty(),
	check ('fieldofstudy', 'fieldofstudy is required')
	.not()
	.isEmpty(),
	check ('from', 'From date is required')
	.not()
	.isEmpty(),
	]], async (req,res) => {

		const errors = validationResult(req);
	 	if (!errors.isEmpty()){
	 		return res.status(400).json({errors: errors.array()});
	 	}

	 	//Copying the request into local constants
	 	const {
	 		school,
	 		degree,
	 		fieldofstudy,
	 		from,
	 		to,
	 		current,
	 		description
	 	} = req.body;

	 	//Creating an object to be inserted
	 	const newEdu = {
	 		school,
	 		degree,
	 		fieldofstudy,
	 		from,
	 		to,
	 		current,
	 		description
	 	}

	 	try{
 
	 		//To place it inside the right profile
	 		const profile = await Profile.findOne({user: req.user.id});

	 		profile.education.unshift(newEdu);
	 		await profile.save();

	 		return res.json(profile);


	 	}

	 	catch(err){
	 		console.error(err.message);
	 		return res.status(500).send('Server Error');

	 	}


});

// @route DELET api/profile/experience/:exp_id
// @desc Delete profile experience
// @access Private

router.delete('/education/:edu_id', auth, async (req, res) => {

try{

	const profile = await Profile.findOne({user: req.user.id});

	//Get the remove index
	const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

	profile.education.splice(removeIndex,1);
	await profile.save();

	res.json(profile);

}
catch (err){
	console.error(err.message);
	res.status(500).send('Server Error');

}

})

module.exports = router;