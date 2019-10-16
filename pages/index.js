import axiosBase from '../utils/axiosBase';
import ProductList from '../components/Index/ProductList';
import ProductPagination from '../components/Index/ProductPagination';

const Home = ({ products, totalPages }) => {
  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  );
};

Home.getInitialProps = async ctx => {
  const page = ctx.query.page || '1';
  const size = 9;
  const payload = { params: { page, size } };
  const response = await axiosBase.get('/products', payload);
  return response.data;
};

export default Home;
