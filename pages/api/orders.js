import jwt from 'jsonwebtoken';

import Order from '../../models/Order';
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
    const orders = await Order.find({ user: userId }).populate({
      path: 'products.product',
      model: 'Product',
    });
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(403).send('Please login again');
  }
};
