const router = require("express").Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/Users");
const { check, validationResult } = require("express-validator");

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

module.exports = router;
