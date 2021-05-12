const router = require("express").Router();
const UserModel = require('../models/User.model')

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

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


module.exports = router;
