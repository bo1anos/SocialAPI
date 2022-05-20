const { Thought, User } = require('../models');

// Aggregate function to get the number of students overall
const reactionCount = async () =>
  Thought.aggregate()
    .count('reactionCount')
    .then((numberOfReactions) => numberOfReactions);

module.exports = {
  // Get all students
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
          reactionCount: await reactionCount(),
        };
        return res.json(thoughtObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single student
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then( (thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new student
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
 updateThought(req, res){
   Thought.findOneAndUpdate(
     {id: req.params.thoughtId},
     {$set:req.body},
     {runValidators:true,new:true}
   )
   .then((thought)=>
     !thought
       ?res.status(404).json({message:'no thought was found with that Id'})
       :res.json(thought)
   
   )
   .catch((err)=>res.status(500).json(err));
 },
  // Delete a student and remove them from the course
 deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No such thought with that ID exists' })
          : User.deleteMany(
            {_id:{$in:thought.users}}
            )
      )
      .then(() =>
           res.json({ message: 'Thought and user deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an assignment to a student
 addReaction(req, res) {
    console.log('You are adding a reaction');
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: {reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID ' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove assignment from a student
 deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with that ID ' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
