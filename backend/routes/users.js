var express = require('express');
var router = express.Router();

const User = require('../models/user');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  if(req.query.query) {
    const regex = new RegExp(req.query.query, 'i');
    const users = await User.find({ name: {$regex: regex} }).limit(6);
    return res.json(users);
  }
  const users = await User.find().limit(6);
  res.json(users);
});

module.exports = router;
