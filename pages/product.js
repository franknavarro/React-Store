import ProductSummary from '../components/Product/ProductSummary';
import ProductAttributes from '../components/Product/ProductAttributes';
import axios from '../utils/axiosBase';

function Product({ product, user }) {
  return (
    <>
      <ProductSummary {...product} />
      <ProductAttributes {...product} user={user} />
    </>
  );
}

Product.getInitialProps = async ({ query: { _id } }) => {
  const url = '/product';
  const payload = { params: { _id } };
  const response = await axios.get(url, payload);
  return { product: response.data };
};

export default Product;
