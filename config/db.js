const mongoose	= require ('mongoose');
const gravatar = require ('gravatar');
const config = require ('config');
const db = config.get('mongoURI');

const connectDB = async () => {
	try{

		await mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

		console.log("Mongoose db connected");

	}
	catch(err){
		console.error(err.message);

		process.exit(1);
	}
}

module.exports = connectDB;