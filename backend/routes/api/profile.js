const router = require("express").Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/Users");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

//@route    GET api/profile/me
// @desc    Get Current User profile
// @access  Private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "avatar"]);
		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}
		return res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

//@route    GET api/profile/me
// @desc    Create/Update User profile
// @access  Private
router.post(
	"/",
	[
		auth,
		[
			check("status", "Status is Required").notEmpty(),
			check("skills", "Skills is Required").notEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			githubusername,
			skills,
			status,
			location,
			instagram,
			linkedin,
			facebook,
			twitter,
			stackoverflow,
			bio,
			youtube,
			personalwebsite,
		} = req.body;
		const profileFields = {};
		profileFields.user = req.user.id;
		if (skills) profileFields.skills = skills;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (location) profileFields.location = location;
		profileFields.socials = {};
		if (youtube) profileFields.socials.youtube = youtube;
		if (stackoverflow) profileFields.socials.stackoverflow = stackoverflow;
		if (facebook) profileFields.socials.facebook = facebook;
		if (instagram) profileFields.socials.instagram = instagram;
		if (twitter) profileFields.socials.twitter = twitter;
		if (personalwebsite)
			profileFields.socials.personalwebsite = personalwebsite;
		if (linkedin) profileFields.socials.linkedin = linkedin;
		if (skills)
			profileFields.skills = skills.split(",").map((skill) => skill.trim());

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true },
				);
				return res.json(profile);
			}
			profile = new Profile(profileFields);
			await profile.save();
			return res.json(profile);
		} catch (error) {
			console.log(error.message);
			return res.status(500).send("Server Error");
		}
	},
);

//@route    GET api/profile/
// @desc    Get All Profiles
// @access  Public
router.get("/", async (req, res) => {
	try {
		const profiles = await Profile.find().populate("user", ["name", "avatar"]);
		res.json(profiles);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

//@route    GET api/profile/user/:user_id
// @desc    Get Profile by user id
// @access  Public
router.get("/user/:user_id", async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate("user", ["name", "avatar"]);
		if (!profile) {
			return res.status(400).json({ msg: "Profile Not Found" });
		}
		return res.json(profile);
	} catch (error) {
		console.error(error.message);
		if (error.kind == "ObjectId")
			return res.status(400).json({ msg: "Profile Not Found" });
		res.status(500).send("Server Error");
	}
});

//@route    DELETE api/profile/
// @desc    Delete profile, user
// @access  Private
router.delete("/", auth, async (req, res) => {
	try {
		await Profile.findOneAndRemove({ user: req.user.id });
		await User.findOneAndRemove({ _id: req.user.id });
		return res.json({ msg: "User Removed" });
	} catch (error) {
		console.log(error.message);
		return res.status(400).send("Server Error");
	}
});

//@route    PUT api/profile/experience
// @desc    Add experience
// @access  Private
router.put(
	"/experience",
	[
		auth,
		[
			check("title", "Title is Required").notEmpty(),
			check("company", "Company is Required").notEmpty(),
			check("from", "From Date is Required").notEmpty(),
		],
	],
	async (req, res) => {
		try {
			errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(400).json({ errors: errors.array() });
			const {
				title,
				company,
				location,
				from,
				to,
				current,
				description,
			} = req.body;
			const newExp = {
				title,
				company,
				location,
				from,
				to,
				description,
				current,
			};
			const profile = await Profile.findOne({ user: req.user.id });
			if (!profile) return res.status(400).send("Server Error");
			profile.experience.push(newExp);
			await profile.save();
			return res.json(profile);
		} catch (error) {
			console.log(error.message);
			return res.status(400).send("Server Error");
		}
	},
);

//@route    DELETE api/profile/experience/:exp_id
// @desc    Delete profile-> experience
// @access  Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		const idx = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id);
		profile.experience.splice(idx, 1);
		await profile.save();
		return res.json({ profile });
	} catch (error) {
		console.log(error.message);
		return res.status(400).send("Server Error");
	}
});

//@route    PUT api/profile/education
// @desc    Add education
// @access  Private
router.put(
	"/education",
	[
		auth,
		[
			check("school", "School is Required").notEmpty(),
			check("degree", "Degree is Required").notEmpty(),
			check("from", "From Date is Required").notEmpty(),
		],
	],
	async (req, res) => {
		try {
			errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(400).json({ errors: errors.array() });
			const {
				school,
				degree,
				fieldofstudy,
				from,
				to,
				current,
				description,
			} = req.body;
			const newEdu = {
				school,
				degree,
				fieldofstudy,
				from,
				to,
				current,
				description,
			};
			const profile = await Profile.findOne({ user: req.user.id });
			if (!profile) return res.status(400).send("Server Error");
			profile.education.push(newEdu);
			await profile.save();
			return res.json(profile);
		} catch (error) {
			console.log(error.message);
			return res.status(400).send("Server Error");
		}
	},
);

//@route    DELETE api/profile/education/:edu_id
// @desc    Delete profile-> education
// @access  Private
router.delete("/education/:edu_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		const idx = profile.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id);
		profile.education.splice(idx, 1);
		await profile.save();
		return res.json({ profile });
	} catch (error) {
		console.log(error.message);
		return res.status(400).send("Server Error");
	}
});

//@route    PUT api/profile/projects
// @desc    Add projects
// @access  Private
router.put(
	"/projects",
	[
		auth,
		[
			check("title", "Title is Required").notEmpty(),
			check("tools", "Tools are Required").notEmpty(),
		],
	],
	async (req, res) => {
		try {
			errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(400).json({ errors: errors.array() });
			const { title, tools, from, to, description, links } = req.body;
			const newPro = {
				title,
				from,
				to,
				description,
			};
			if (tools) {
				const toolsArr = tools.split(",").map((tool) => tool.trim());
				newPro.tools = toolsArr;
			}
			if (links) {
				const linksArr = links.split(",").map((tool) => tool.trim());
				newPro.links = linksArr;
			}

			const profile = await Profile.findOne({ user: req.user.id });
			if (!profile) return res.status(400).send("Server Error");
			profile.projects.push(newPro);
			await profile.save();
			return res.json(profile);
		} catch (error) {
			console.log(error.message);
			return res.status(400).send("Server Error");
		}
	},
);

//@route    DELETE api/profile/projects/:pro_id
// @desc    Delete profile-> projects
// @access  Private
router.delete("/projects/:pro_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		const idx = profile.projects
			.map((item) => item.id)
			.indexOf(req.params.pro_id);
		profile.projects.splice(idx, 1);
		await profile.save();
		return res.json({ profile });
	} catch (error) {
		console.log(error.message);
		return res.status(400).send("Server Error");
	}
});

//@route    GET api/profile/github/:username
// @desc    Get repos from Github
// @access  Public
router.get("/github/:username", (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${
				req.params.username
			}/repos?per_page=10&sort=created:asc&client_id=${config.get(
				"githubClientId",
			)}&client_secret=${config.get("githubSecret")}`,
			method: "GET",
			headers: { "user-agent": "node.js" },
		};
		request(options, (error, response, body) => {
			if (error) console.log(error);
			if (response.statusCode != 200) {
				return res.status(404).json({ msg: "No Github Profile Found" });
			}
			return res.json(JSON.parse(body));
		});
	} catch (error) {
		console.log(error.message);
		return res.status(400).send("Server Error");
	}
});
module.exports = router;
