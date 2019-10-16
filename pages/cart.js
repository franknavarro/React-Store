import { Segment } from 'semantic-ui-react';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';

import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import axiosBase from '../utils/axiosBase';
import catchErrors from '../utils/catchErrors';

function Cart({ user, products }) {
  const [cartProducts, setCartProducts] = React.useState(products);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleRemoveFromCart = async productId => {
    const response = await axiosBase.delete('/cart', {
      params: { productId },
      headers: { Authorization: cookie.get('token') },
    });
    setCartProducts(response.data);
  };

  const handleCheckout = async paymentData => {
    try {
      setLoading(true);
      const payload = { paymentData };
      const headers = { headers: { Authorization: cookie.get('token') } };
      await axiosBase.post('/checkout', payload, headers);
      setSuccess(true);
    } catch (err) {
      catchErrors(err, window.alert);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Segment>
      <CartItemList
        handleRemoveFromCart={handleRemoveFromCart}
        user={user}
        products={cartProducts}
        success={success}
      />
      <CartSummary
        products={cartProducts}
        handleCheckout={handleCheckout}
        success={success}
      />
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
