const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought);

// /api/courses/:courseId
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

router
  .route('/:thoughtId/:reactions')
  .post(addReaction); 

router
  .route('/:thoughtId/:reactions/:reactionId')
  .delete(removeReaction);

module.exports = router;
