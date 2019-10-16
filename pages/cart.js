import { Segment } from 'semantic-ui-react';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';

import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import axiosBase from '../utils/axiosBase';

function Cart({ user, products }) {
  const [cartProducts, setCartProducts] = React.useState(products);

  const handleRemoveFromCart = async productId => {
    const response = await axiosBase.delete('/cart', {
      params: { productId },
      headers: { Authorization: cookie.get('token') },
    });
    setCartProducts(response.data);
  };

  return (
    <Segment>
      <CartItemList
        handleRemoveFromCart={handleRemoveFromCart}
        user={user}
        products={cartProducts}
      />
      <CartSummary products={cartProducts} />
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
