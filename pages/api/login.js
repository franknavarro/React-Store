import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import connectDb from '../../utils/connectDb';
import User from '../../models/User';

connectDb();

export default async (req, res) => {
  const { email, password } = req.body;
  try {
    // check to see if a user exists with provided email
    const user = await User.findOne({ email }).select('+password');
    // -- if not return error
    if (!user) {
      return res.status(404).send('No user exists with that email');
    }
    // check to see if users password matches the one in db
    const passwordsMatch = await bcrypt.compare(password, user.password);
    // --if so generate a token
    if (passwordsMatch) {
      const token = await jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
      );
      // send that token to the client
      res.status(200).json(token);
    } else {
      res.status(401).send('Passwords do not match');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logining in');
  }
};
