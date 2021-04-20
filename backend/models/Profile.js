const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	education: [
		{
			school: {
				type: String,
				required: true,
			},
			degree: {
				type: String,
				required: true,
			},
			fieldofstudy: {
				type: String,
			},
			from: {
				type: Date,
				required: true,
			},
			to: {
				type: Date,
			},
			current: {
				type: Boolean,
				default: false,
			},
			description: {
				type: String,
			},
		},
	],
	location: {
		type: String,
	},
	status: {
		type: String,
		required: true,
	},
	skills: {
		type: [String],
		required: true,
	},
	bio: {
		type: String,
	},
	githubusername: {
		type: String,
	},
	projects: [
		{
			title: {
				type: String,
				required: true,
			},
			tools: {
				type: [String],
			},
			from: {
				type: Date,
			},
			to: {
				type: Date,
			},
			description: {
				type: String,
			},
			links: {
				type: [String],
			},
		},
	],
	experience: [
		{
			title: {
				type: String,
				required: true,
			},
			company: {
				type: String,
			},
			from: {
				type: Date,
			},
			to: {
				type: Date,
			},
			description: {
				type: String,
			},
		},
	],

	socials: {
		youtube: {
			type: String,
		},
		twitter: {
			type: String,
		},
		instagram: {
			type: String,
		},
		stackoverflow: {
			type: String,
		},
		facebook: {
			type: String,
		},
		linkedin: {
			type: String,
		},
		personalwebsite: {
			type: String,
		},
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
