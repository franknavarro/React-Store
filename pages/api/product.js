import Product from '../../models/Product';
import Cart from '../../models/Cart';
import Order from '../../models/Order';
import connectDb from '../../utils/connectDb';

connectDb();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      await handleGetRequest(req, res);
      break;
    case 'POST':
      await handlePostRequest(req, res);
      break;
    case 'DELETE':
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${method} not allowed`);
  }
};

async function handleGetRequest(req, res) {
  const { _id } = req.query;
  const product = await Product.findById(_id);
  res.status(200).json(product);
}

async function handlePostRequest(req, res) {
  try {
    const { name, price, description, mediaUrl } = req.body;
    if (!name || !price || !description || !mediaUrl) {
      return res.status(422).send('Product missing one or more fields');
    }
    const product = await new Product({
      name,
      price,
      description,
      mediaUrl,
    }).save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error in creating product');
  }
}

async function handleDeleteRequest(req, res) {
  try {
    const { _id } = req.query;
    await Product.findOneAndDelete({ _id });
    await Cart.updateMany(
      { 'products.product': _id },
      { $pull: { products: { product: _id } } },
    );
    await Order.updateMany(
      { 'products.product': _id },
      { $pull: { products: { product: _id } } },
    );
    res.status(204).json({});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting product');
  }
}
