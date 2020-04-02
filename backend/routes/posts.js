const express = require("express");
const passport = require("passport");
const router = express.Router();
const Post = require("../models/Post");

/**
 * @route GET api/posts/
 * @desc Get all posts from the newest to oldest
 * @access Public
 */

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 }) // sort by date in reverse order to get the newest
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).send(err));
});

/**
 * @route GET api/posts/post/:postId
 * @desc Get a post by post id
 * @access Public
 */

router.get("/post/:postId", (req, res) => {
  Post.findById(req.params.postId)
    .then((post) => res.json(post))
    .catch((err) => res.status(404).send(err));
});

/**
 * @route GET api/posts/user/:ownerId
 * @desc Get all posts of a user
 * @access Public
 */

router.get("/user/:ownerId", (req, res) => {
  Post.find({ ownerId: req.params.ownerId })
    .sort({ date: -1 }) // sort by date in reverse order to get the newest
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).send(err));
});

/**
 * @route POST api/posts/
 * @desc Create a post
 * @access Protected
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.body.ownerId = req.user.id;
    new Post(req.body)
      .save()
      .then((post) => res.status(200).json(post))
      .catch((err) => res.status(400).send(err));
  },
);

/**
 * @route PATCH api/posts/post/:postId
 * @desc Update a post by post id
 * @access Protected
 */
router.patch(
  "/post/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.postId)
      .then((post) => {
        for (let key in req.body) {
          if (post[key] && post[key] !== req.body[key]) {
            post[key] = req.body[key];
          }
        }
        post.save();
        res.status(200).json(post);
      })
      .catch((err) => res.send(404).res.send(err));
  },
);

/**
 * @route DELETE api/posts/post/:postId
 * @desc Delete a post by post id
 * @access Protected
 */
router.delete(
  "/post/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOneAndRemove(req.params.postId, (err) => {
      if (err) res.status(404).send(err);
      res.status(200).send("Sucessfully deleted post.");
    });
  },
);
module.exports = router;
