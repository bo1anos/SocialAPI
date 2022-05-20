const { Schema, model } = require('mongoose');

// Schema to create Student model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique:true,
      required: true,
      max_length: 100,
      trim:true,
    },
    email: {
      type: String,
      required: true,
      max_length: 50,
      unique:true ,
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/], 
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref:'Thought'
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref:'User'
    }],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id:false,
  }
);
userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
