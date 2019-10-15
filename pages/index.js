import React from 'react';
import axios from '../utils/axiosBase';

import ProductList from '../components/Index/ProductList';

function Home({ products }) {
  return <ProductList products={products} />;
}

Home.getInitialProps = async () => {
  const url = '/products';
  const response = await axios.get(url);
  return { products: response.data };
};

export default Home;
