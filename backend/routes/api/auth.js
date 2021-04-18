const router = require("express").Router();
const auth = require("../../middleware/auth");
const User = require("../../models/Users");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");

//@route    GET api/auth
// @desc    Test route
// @access  Private
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		return res.json(user);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server Error");
	}
});

//@route    POST api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post(
	"/",
	[
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
		const { email, password } = req.body;

		try {
			// Find if user Exists
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid Credentials" }] });
			}
			//Password Match
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch)
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid Credentials" }] });

			const payload = {
				user: {
					id: user.id,
				},
			};
			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				},
			);
		} catch (err) {
			console.log(err.message);
			return res.status(500).send(err.message);
		}
	},
);
module.exports = router;
