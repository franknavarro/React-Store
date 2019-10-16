import { Segment } from 'semantic-ui-react';
import { parseCookies } from 'nookies';

import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import axiosBase from '../utils/axiosBase';

function Cart({ products }) {
  console.log(products);
  return (
    <Segment>
      <CartItemList />
      <CartSummary />
    </Segment>
  );
}

Cart.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { products: [] };
  }
  const response = await axiosBase.get('/cart', {
    headers: { Authorization: token },
  });
  return { products: response.data };
};

export default Cart;
