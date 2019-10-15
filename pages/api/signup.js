import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import connectDb from '../../utils/connectDb';
import User from '../../models/User';

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;
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
