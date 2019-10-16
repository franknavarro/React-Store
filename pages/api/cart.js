import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import connectDb from '../../utils/connectDb';
import Cart from '../../models/Cart';

connectDb();

const { ObjectId } = mongoose.Types;

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      await handleGetRequest(req, res);
      break;
    case 'PUT':
      await handlePutRequest(req, res);
      break;
    case 'DELETE':
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
  }
};

const handleGetRequest = async (req, res) => {
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

const handlePutRequest = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send('No authorization token');
  }

  const { quantity, productId } = req.body;
  try {
    const { userId } = await jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
    );
    // Get user cart based on userId
    const cart = await Cart.findOne({ user: userId });
    // Check if product already exists in cart
    console.log({ cart });
    const productExists = cart.products.some(doc =>
      ObjectId(productId).equals(doc.product),
    );
    // --if so increment quantity by number provided in request
    if (productExists) {
      await Cart.findOneAndUpdate(
        { _id: cart._id, 'products.product': productId },
        { $inc: { 'products.$.quantity': quantity } },
      );
    } else {
      // --if not add new product with given quantity
      const newProduct = { quantity, product: productId };
      await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $addToSet: { products: newProduct } },
      );
    }

    res.status(200).send('Cart updated');
  } catch (err) {
    console.error(err);
    res.status(403).send('Please login again');
  }
};

const handleDeleteRequest = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send('No authorization token');
  }
  try {
    const { productId } = req.query;
    const { userId } = await jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
    );
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true },
    ).populate({
      path: 'products.product',
      model: 'Product',
    });

    res.status(200).json(cart.products);
  } catch (err) {
    console.error(err);
    res.status(403).send('Please login again');
  }
};
