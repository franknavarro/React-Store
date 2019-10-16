import Product from '../../models/Product';
import connectDb from '../../utils/connectDb';

connectDb();

export default async (req, res) => {
  // Convert the query string values to numbers
  const pageNum = Number(req.query.page);
  const pageSize = Number(req.query.size);

  const totalDocs = await Product.countDocuments();
  const totalPages = Math.ceil(totalDocs / pageSize);

  const skips = pageSize * (pageNum - 1);
  const products = await Product.find()
    .skip(skips)
    .limit(pageSize);

  res.status(200).json({ products, totalPages });
};
