import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

import connectDb from '../../utils/connectDb';
import User from '../../models/User';
import Cart from '../../models/Cart';

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;

  let fieldErrors;
  if (!isLength(name, { min: 3, max: 10 })) {
    fieldErrors = 'Name must be 3-10 characters long';
  } else if (!isLength(password, { min: 6 })) {
    fieldErrors = 'Password must be at least 6 characters long';
  } else if (!isEmail(email)) {
    fieldErrors = 'Email must be valid';
  }
  if (fieldErrors) {
    return res.status(422).send(fieldErrors);
  }

  try {
    // Check to see if the user already exists in the db
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send(`User already exists with email ${email}`);
    }
    // if not hash thier password
    const hash = await bcrypt.hash(password, 10);
    // create user
    const newUser = await new User({ name, email, password: hash }).save();
    await new Cart({ user: newUser._id }).save();
    // create token for the new user
    const token = await jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    // send back user token
    res.status(201).json(token);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error signup user. Please try again later.');
  }
};
