import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import connectDb from '../../utils/connectDb';
import Cart from '../../models/Cart';

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
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'products.product',
      model: 'Product',
    });
    res.status(200).json(cart.products);
  } catch (err) {
    console.error(err);
    res.status(403).send('Please login again');
  }
};
