
const { Schema, model } = require("mongoose");
require('./User.model')

// 1. Define your schema
let ConversationSchema = new Schema({
  participants: [{
      ref: 'user',
      type: Schema.Types.ObjectId
    },
  ] 
})

// 2. Define your model
let ConversationModel = model('conversation', ConversationSchema)

// 3. Export your Model with 'module.exports'
module.exports = ConversationModel