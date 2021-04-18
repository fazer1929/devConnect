const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const User = require("../../models/Users");
//@route    POST api/users
// @desc    Register User
// @access  Public
router.post(
	"/",
	[
		check("name", "Name is Required").notEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check("password", "Min 6 characters required in password").isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password } = req.body;

		try {
			// Find if user Exists
			let user = await User.findOne({ email });
			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User Already Exists" }] });
			}
			// Get the gravatar
			const avatar = gravatar.url(email, {
				s: "200",
				r: "pg",
				d: "mm",
			});
			user = new User({
				name,
				email,
				password,
				avatar,
			});
			// Hash Password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			// Save User
			await user.save();
			return res.send("user registered");
		} catch (err) {
			console.log(err.message);
			return res.status(500).send(err.message);
		}
	},
);

module.exports = router;
