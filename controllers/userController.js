const { Thought, User } = require('../models');

// Aggregate function to get the number of students overall
const friendCount = async () =>
  User.aggregate()
    .count('friendCount')
    .then((numberOfFriends) => numberOfFriends);

module.exports = {
  // Get all students
  getUsers(req, res) {
    User.find()
    .populate({path:'thoughts',select:'-__v'})
    .populate({path:'friends',select:'-__v'})
    .select('-__v')
    .then(async (users)=>{
      return res.json(users);
    })
    .catch((err) =>{
      console.log(err);
      return res.status(500).json(err)

    })
  },
  // Get a single student
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({path:'thoughts',select:'__v'})
      .populate({path:'friends',select:'__v'})
      .select('-__v')
      .then( async (users) =>{
        return res.json(users)
       })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new student
  createUser(req, res) {
    User.create(req.body)
      .then((user)=>res.json(user))
      .catch((err)=>res.status(500).json(err));
  },
 updateUser(req, res){
   User.findOneAndUpdate(
     {id: req.params.userId},
     {$set:req.body},
     {runValidators:true,new:true}
   )
   .then((user)=>
     !user
       ?res.status(404).json({message:'no user was found with that Id'})
       :res.json(user)
   
   )
   .catch((err)=>res.status(500).json(err));
 },
  // Delete a student and remove them from the course
 deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user with that ID exists' })
          : Thought.findOneAndUpdate(
            {users:req.params.userId},
            {$pull:{users:req.params.userId}},
            {new:true}
            )
      )
      .then((thought) =>
           !thought
           ? res.status(404).json({message:'use deleted but no thoughts found',})
           :res.json({message:'user deleted successfully'})
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an assignment to a student
 addFriend(req, res) {
    console.log('You are adding a friend');
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: {friends: req.body.newFriend } },
      { runValidators: true, new: true }
    )
      .populate({path:'friends',select:'-__v'})
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that ID ' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove assignment from a student
 removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends:  req.params.friendId  } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that ID ' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};