const jwt = require('jsonwebtoken');
const config = require ('config');

module.exports = function (req, res, next) {

	//get token from header

	const token = req.header('x-auth-token');

	//check if present

	if (!token){
		return res.status(401).json({ msg: 'Authorization Denied, Token Missing' });
	}

	//Verify Token 

	try {

		const decoded = jwt.verify(token, config.get('jwtSecret'));
		req.user =decoded.user;
		next();
	}
	catch(err){
		res.status('401').json({ msg:'Authorzation Denied, Invalid Token'})
	}
}