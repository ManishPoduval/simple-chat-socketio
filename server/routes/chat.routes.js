const router = require("express").Router();
const UserModel = require('../models/User.model')
const Conversation = require('../models/Conversation.model')
const Message = require('../models/Message.model')

// GET all users names to show on the home page
router.get("/users", (req, res, next) => {
  UserModel.find()
    .then((response) => {
      res.status(200).json( response)
    })
    .catch((err) => {
      next(err)
    })
});

// A route to return the converstaion id between two participants if it already exists
// or create a new converstaion, when users chat for the first time
router.post('/conversation', (req, res, next) => {
    const {participants} = req.body
    Conversation.findOne({ participants: { $all: participants} })
      .then((found) => {
        if (found) {
          //Converstaion between the participants already present
          res.status(200).json(found)
        }
        else {
          //Create a conversation between them if not present
          Conversation.create({participants})
            .then((response) => {
              res.status(200).json(response)
            })
        }
      })
      .catch((err) => {
          next(err)       
      })
})

// A route to get all messages of a certain converstaion 
router.get('/messages/:conversationId', (req, res, next) => {
  const {conversationId} = req.params
  Message.find({conversationId})
    .populate('sender')
    .then((messages) => {
      res.status(200).json(messages)
    })
    .catch((err) => {
      next(err)       
  })
})

module.exports = router;
