import User from '../../models/User';
import jwt from 'jsonwebtoken';
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
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(403).send('Invalid token');
  }
};
