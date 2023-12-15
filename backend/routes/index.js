var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");

const checkAuth = require("../middleware/checkAuth");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ 'message': 'Welcome to the API' });
});

router.post('/register', async function (req, res, next) {
  const { name, email, password, username } = req.body;

  // Simple validation
  if (!name || !email || !password || !username) {
    return res.status(400).json({ 'message': 'Please enter all fields' });
  }

  // Check for existing user
  let userExists = await User.findOne({ email }).exec();
  console.log(userExists);

  if (userExists) {
    return res.status(409).json({ 'message': 'Email already exists' });
  };

  userExists = await User.findOne({ username }).exec();

  if (userExists) {
    return res.status(409).json({ 'message': 'Username already exists' });
  };

  // Create new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    username,
    password: hashedPassword
  });

  await newUser.save();
  res.json({ 'message': 'User created' });
});

router.post('/login', async function (req, res, next) {
  const user = await User.findOne({ username: req.body.username }).exec();

  // Check for existing user
  if (!user) {
    return res.status(400).json({ 'message': 'User does not exist' });
  };

  // Validate password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ 'message': 'Invalid password' });
  };

  // Create and assign token
  const token = jwt.sign({ _id: user._id, username: user.username, name: user.name }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

  res.json({ 'message': 'Logged in', name: user.name, username: user.username, token: token });
});

router.get('/messages', checkAuth, async function (req, res, next) {
  const { roomid } = req.query;
  const my_id = req.user._id;

  try {
    const messages = await Message.find({ conversation_hash: roomid }).exec();
    const conversation = await Conversation.findOne({ conversation_hash: roomid }).exec();
    if (conversation.owner == my_id) {
      conversation.unread_count = 0;
      await conversation.save();
    }
    res.json({ 'message': 'Messages found', messages: messages });
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ 'message': 'Something went wrong' });
  }
});

router.get('/inbox', checkAuth, async function (req, res, next) {
  const my_id = req.user._id;

  try {
    const [conversations, me] = await Promise.all([Conversation.find({ owner: my_id }).sort({last_sent_time: -1}).populate('last_sent_user').exec(), User.findOne({ _id: my_id }).exec()]);
    res.json({ 'message': 'Friends found', conversations: conversations, user: me });
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ 'message': 'Something went wrong' });
  }
});

router.get('/friends', checkAuth, async function (req,res,next) {
  const my_id = req.user._id;

  try {
    const me = await User.findOne({ _id: my_id }).populate('friends').exec();
    const friends = me.friends.map(friend => friend._id);
    res.json({ friends });
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ 'message': 'Something went wrong' });
  }
});

router.get('/friendreqsent', checkAuth, async function (req,res,next) {
  const my_id = req.user._id;

  try {
    const me = await User.findOne({ _id: my_id }).populate('friend_requests_sent').exec();
    const friend_requests_sent = me.friend_requests_sent.map(friend => friend._id);
    res.json({ friend_requests_sent });
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ 'message': 'Something went wrong' });
  }
})

router.post('/addfriend', checkAuth, async function (req, res, next) {
  const { friendId } = req.body;
  const my_id = req.user._id;

  try {
    //Checking if friend exists
    const friend = await User.findOne({ _id: friendId }).exec();
    if (!friend) {
      return res.status(400).json({ 'message': 'User does not exist' });
    };

    const me = await User.findOne({ _id: my_id }).exec();

    //Checking if friend request already sent
    if (me.friend_requests_sent.includes(friendId)) {
      return res.status(400).json({ 'message': 'Friend request already sent' });
    };

    //Checking if we're already friends
    if (me.friends.includes(friendId)) {
      return res.status(400).json({ 'message': 'You are already friends' });
    };

    friend.friend_requests.push(my_id);
    await friend.save();

    me.friend_requests_sent.push(friendId);
    await me.save();

    res.json({ 'message': 'Friend request sent' });
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ 'message': 'Something went wrong' });
  }
});

router.get('/friendrequests', checkAuth, async function (req, res, next) {
  const my_id = req.user._id;

  try {
    const me = await User.findOne({ _id: my_id }).populate('friend_requests').exec();
    res.json(me.friend_requests);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ 'message': 'Something went wrong' });
  }
});

router.post('/acceptrequest', checkAuth, async (req, res, next) => {
  const { friendId } = req.body;
  const my_id = req.user._id;

  try {
    //Checking if friend exists
    const friend = await User.findOne({ _id: friendId }).exec();
    const me = await User.findOne({ _id: my_id }).exec();
    if (!friend) {
      return res.status(400).json({ 'message': 'User does not exist' });
    };
    

    friend.friends.push(my_id);
    friend.friend_requests_sent = friend.friend_requests_sent.filter(id => id != my_id);
    await friend.save();

    
    me.friends.push(friendId);
    me.friend_requests = me.friend_requests.filter(id => id != friendId);
    await me.save();


    //Creating coversation for both 
    const conversation = new Conversation({
      owner: my_id,
      friend_name: friend.name,
      conversation_hash: my_id + friendId,
      last_message: 'Start a conversation',
      last_sent_time: Date.now(),
    });
    await conversation.save();

    const conversation2 = new Conversation({
      owner: friendId,
      friend_name: me.name,
      conversation_hash: my_id + friendId,
      last_message: 'Start a conversation',
      last_sent_time: Date.now(),
    });
    await conversation2.save();

    res.json({ 'message': 'Friend request accepted' });
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ 'message': 'Something went wrong' });
  }
});

router.post('/rejectrequest', checkAuth, async (req, res, next) => {
  const { friendId } = req.body;
  const my_id = req.user._id;

  try {
    //Checking if friend exists
    const friend = await User.findOne({ _id: friendId }).exec();
    if (!friend) {
      return res.status(400).json({ 'message': 'User does not exist' });
    };

    friend.friend_requests_sent = friend.friend_requests_sent.filter(id => id != my_id);
    await friend.save();

    const me = await User.findOne({ _id: my_id }).exec();
    me.friend_requests = me.friend_requests.filter(id => id != friendId);
    await me.save();

    res.json({ 'message': 'Friend request rejected' });
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ 'message': 'Something went wrong' });
  }
});

router.get('/checkAuth', checkAuth, function (req, res, next) {
    console.log(req.user);
    res.status(200).json({ 'message': 'You are logged in', user: req.user });
  });

module.exports = router;
