// https://localhost:3001/api/thoughts
const router = require("express").Router()
const { isObjectIdOrHexString } = require("mongoose")
const { Thought, Reaction, User } = require("../../models")

//TODO: ROUTE TO GET ALL THOUGHTS
router.get("/", async (req, res) => {
  try {
    let thoughts = await Thought.find({}).populate("reactions")
    res.status(200).json(thoughts)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//TODO: ROUTE TO CREATE A NEW THOUGHT
router.post("/", async (req, res) => {
  try {
    let newThought = await Thought.create(req.body)

    //also need to update user with new thought id
    if (newThought) {
      await User.findOneAndUpdate(
        { username: req.body.username },
        { $push: { thoughts: newThought._id } }
      )
    }
    console.log(newThought)
    res.status(200).json(newThought)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//TODO: ROUTE TO GET SINGLE THOUGHT BASED ON THOUGHT ID
router.get("/:thoughtId", async (req, res) => {
  try {
    let singleThought = await Thought.findOne({ _id: req.params.thoughtId })
    console.log(singleThought)
    res.status(200).json(singleThought)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//TODO: ROUTE TO UPDATE A THOUGHT
router.put("/", async (req, res) => {
  try {
    let updateThought = await Thought.findOneAndUpdate(
      { _id: req.body.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    console.log(updateThought)
    res.status(200).json(updateThought)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//TODO: ROUTE TO DELETE A THOUGHT BASED ON THOUGHT ID
router.delete("/:thoughtId", async (req, res) => {
  try {
    let deleteThought = await Thought.findOneAndDelete({
      _id: req.params.thoughtId,
    })
    console.log(deleteThought)
    res.status(200).json(deleteThought)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//TODO: ROUTE TO ADD REACTION TO A THOUGHT
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    console.log(req.body, req.params.thoughtId)

    let newReaction = await Reaction.create(req.body)
    console.log(newReaction)

    let updateThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      {
        $push: { reactions: newReaction._id },
      }
    )
    console.log(updateThought)
    res.status(200).json("hooray 🎉")
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//TODO: ROUTE TO DELETE A REACTION ON A THOUGHT
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    let deleteReaction = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: req.params.reactionId } },
      { new: true }
    )
    console.log(deleteReaction)
    res.status(200).json(deleteReaction)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

module.exports = router
