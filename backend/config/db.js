const mongoose = require("mongoose");
const config = require("config");
const db = config.get("DB_URI");

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("DB is Connected.");
	} catch (e) {
		console.error(e.message);
		// Exit Process on Fail
		process.exit(1);
	}
};

module.exports = connectDB;
