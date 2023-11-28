const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  // Check if the username is already taken
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send('Username already taken.');
  }

  // Username is not taken already!
  // Check if the password and confirm password match
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Password and Confirm Password must match');
  }

  // Must hash the password before sending to the database
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  // All ready to create the new user!
  const user = await User.create(req.body);

  res.send(`Thanks for signing up ${user.username}`)
});

module.exports = router;
