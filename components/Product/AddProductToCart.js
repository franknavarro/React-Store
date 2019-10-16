import { Input } from 'semantic-ui-react';
import { useRouter } from 'next/router';

import catchErrors from '../../utils/catchErrors';
import axiosBase from '../../utils/axiosBase';
import cookie from 'js-cookie';

function AddProductToCart({ user, productId }) {
  const [quantity, setQuantity] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let timeout;
    if (success) {
      timeout = setTimeout(() => setSuccess(false), 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  const handleAddProductToCart = async () => {
    try {
      setLoading(true);
      const payload = { productId, quantity };
      const headers = { headers: { Authorization: cookie.get('token') } };
      await axiosBase.put('/cart', payload, headers);
      setSuccess(true);
    } catch (err) {
      catchErrors(err, window.alert);
    } finally {
      setLoading(false);
    }
  };

  const buttonOps =
    user && success
      ? {
          color: 'blue',
          content: 'Item Added',
          icon: 'plus cart',
          disabled: true,
        }
      : user
      ? {
          color: 'orange',
          content: 'Add to Cart',
          icon: 'plus cart',
          loading,
          disabled: loading,
          onClick: handleAddProductToCart,
        }
      : {
          color: 'blue',
          content: 'Sign Up To Purchase',
          icon: 'signup',
          onClick: () => router.push('/signup'),
        };

  return (
    <Input
      type="number"
      min="1"
      value={quantity}
      onChange={event => setQuantity(Number(event.target.value))}
      placeholder="Quantity"
      action={buttonOps}
    />
  );
}

export default AddProductToCart;
