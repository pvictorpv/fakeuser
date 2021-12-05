const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const con = await mongoose.connect(
			'mongodb://pvictorpv:415263@nodejs-sandbox-shard-00-00.e0v32.mongodb.net:27017,nodejs-sandbox-shard-00-01.e0v32.mongodb.net:27017,nodejs-sandbox-shard-00-02.e0v32.mongodb.net:27017/nodejs-sandbox?ssl=true&replicaSet=atlas-13wz8c-shard-0&authSource=admin&retryWrites=true&w=majority'
		); // process.env.MONGO_URI

		console.log('MongoDB connected');
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

module.exports = connectDB;
