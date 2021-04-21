const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/Users");

//@route    POST api/posts
// @desc    Create a Post
// @access  Private
router.post(
	"/",
	[auth, [check("text", "Text is required").notEmpty()]],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.json(errors.array());
			const user = await User.findById(req.user.id).select("-password");
			const newPost = {
				text: req.body.text,
				title: req.body.title,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};
			const post = await Post(newPost).save();
			return res.json(post);
		} catch (error) {
			console.log(error.message);
			return res.status(500).send("Server Error");
		}
	},
);

//@route    GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		return res.json(posts);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send("Server Error");
	}
});

//@route    GET api/posts/:post_id
// @desc    Get post by ID
// @access  Private
router.get("/:post_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) return res.status(404).json({ msg: "Post not found" });
		return res.json(post);
	} catch (error) {
		console.log(error.message);
		if (error.kind == "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		return res.status(500).send("Server Error");
	}
});

//@route    DELETE api/posts/:post_id
// @desc    Delete post by ID
// @access  Private
router.delete("/:post_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) return res.status(404).json({ msg: "Post not found" });

		if (post.user.toString() != req.user.id)
			return res.status(400).json({ msg: "User not authorized" });

		post.remove();
		return res.json({ msg: "Post Deleted" });
	} catch (error) {
		console.log(error.message);
		if (error.kind == "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		return res.status(500).send("Server Error");
	}
});

//@route    Put api/posts/like/:post_id
// @desc    like/unlike post by ID
// @access  Private
router.put("/like/:post_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) return res.status(404).json({ msg: "Post not found" });
		const idx = post.likes
			?.map((like) => like.user.toString())
			.indexOf(req.user.id);

		if (idx != -1) {
			post.likes.splice(idx, 1);
		} else {
			post.likes.push({ user: req.user.id });
		}
		await post.save();
		return res.json({ likes: post.likes });
	} catch (error) {
		console.log(error.message);
		if (error.kind == "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		return res.status(500).send("Server Error");
	}
});

//@route    POST api/posts/comment/:id
// @desc    Create a Comment
// @access  Private
router.post(
	"/comment/:id",
	[auth, [check("text", "Text is required").notEmpty()]],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.json(errors.array());
			const user = await User.findById(req.user.id).select("-password");
			const post = await Post.findById(req.params.id);

			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};
			post.comments.unshift(newComment);
			await post.save();
			return res.json(post.comments);
		} catch (error) {
			console.log(error.message);
			return res.status(500).send("Server Error");
		}
	},
);

//@route    DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a Comment
// @access  Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const comment = post.comments.find(
			(comment) => comment.id == req.params.comment_id,
		);
		if (!comment) return res.status(404).json({ msg: "Comment Not Found" });

		if (comment.user.toString() != req.user.id) {
			return res.status(400).json({ msg: "User is not authorized" });
		}

		const idx = post.comments.indexOf(comment);
		post.comments.splice(idx, 1);
		await post.save();
		return res.json(post.comments);
	} catch (error) {
		console.log(error.message);
		return res.status(500).send("Server Error");
	}
});

module.exports = router;
