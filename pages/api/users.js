import jwt from 'jsonwebtoken';

import User from '../../models/User';
import connectDb from '../../utils/connectDb';

connectDb();

export default async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send('No authorization token');
  }

  try {
    const { userId } = await jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
    );
    const users = await User.find({ _id: { $ne: userId } }).sort({
      role: 'asc',
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(403).send('Please login again');
  }
};
