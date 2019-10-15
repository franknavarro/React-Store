import Product from '../../models/Product';

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      await handleGetRequest(req, res);
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

async function handleDeleteRequest(req, res) {
  const { _id } = req.query;
  await Product.findOneAndDelete({ _id });
  res.status(204).json({});
}
