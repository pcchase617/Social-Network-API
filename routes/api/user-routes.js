// https://localhost:3001/api/users
const router = require('express').Router();
const {User, Thought} = require("../../models")

//TODO - ROUTE THAT GETS ALL THE USERS, include friends?
router.get('/', async(req,res)=> {
    try{
        let allUsers = await User.find({})
            .populate('friends')
        res.status(200).json(allUsers)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

//TODO - ROUTE THAT CREATES A NEW USER
router.post('/', async(req,res)=> {
    try{
        let newUser = await User.create(req.body)
        console.log(newUser)
        res.status(200).json(newUser)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

//TODO - ROUTE THAT GETS A SINGLE USER BASED ON USER ID
router.get('/:userId', async(req,res) => {
    try {
        let singleUser = await User.findOne({_id: req.params.userId})
        console.log(singleUser)
        res.status(200).json(singleUser)
    } catch (err) {
        console.log(err) 
            res.status(500).json(err)
    }
})

//TODO - ROUTE THAT UPDATES A SINGLE USER
router.put('/:userId', async(req,res)=> {
    try {
        let updateUser = await User.findOneAndUpdate({_id: req.params.userId}, {$set: req.body}, {runValidators: true, new: true})
        console.log(updateUser)
        res.status(200).json(updateUser)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

//TODO - ROUTE THAT DELETES A SINGLE USER BASED ON USER ID
router.delete('/:userId', async(req,res)=> {
    try {
        let deleteUser = await User.findOneAndDelete({_id: req.params.userId})
        console.log(deleteUser)
        const deleteThoughts = Thought.deleteMany({_id: {$in: deleteUser.thoughts}})
        res.status(200).json({deleteThoughts, deleteUser})
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

//TODO - ROUTE THAT ADDS A FRIEND TO A USER
router.put('/:userId/friends/:friendId', async(req,res)=> {
    try {
        let newFriend = await User.findOneAndUpdate({_id: req.params.userId}, {$addToSet: {friends: req.params.friendId}}, {new: true})
        console.log(newFriend)
        res.status(200).json(newFriend)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

//TODO - ROUTE THAT DELETES A FRIEND FROM A USER'S FRIENDS, DONT DELETE THE FRIEND AS A USER THOUGH!
router.delete('/:userId/friends/:friendId', async(req,res)=> {
  try{
    let deleteFriend = await User.findOneAndUpdate({_id: req.params.userId}, {$pull: {friends: req.params.friendId}}, {new: true})
    console.log(deleteFriend)
    res.status(200).json(deleteFriend)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

module.exports = router;
