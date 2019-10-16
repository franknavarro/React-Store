import {
  Header,
  Segment,
  Button,
  Icon,
  Item,
  Message,
} from 'semantic-ui-react';
import { useRouter } from 'next/router';

function CartItemList({ user, products, handleRemoveFromCart, success }) {
  const router = useRouter();

  const renderUserButton = () => {
    if (user) {
      return (
        <Button color="orange" onClick={() => router.push('/')}>
          View Products
        </Button>
      );
    } else {
      return (
        <Button color="blue" onClick={() => router.push('/login')}>
          Login to Add Products
        </Button>
      );
    }
  };

  if (success) {
    return (
      <Message
        success
        header="Success!"
        content="Your order and payment has been accepted"
        icon="star outline"
      />
    );
  }

  // Display empty cart
  if (!products.length) {
    return (
      <Segment secondary color="teal" inverted textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket" />
          No products in your cart. Add some!
        </Header>
        <div>{renderUserButton()}</div>
      </Segment>
    );
  }

  // Map over products to show cart items
  const mapCartProductsToItems = products => {
    return products.map(p => ({
      childKey: p.product._id,
      header: (
        <Item.Header
          as="a"
          onClick={() => router.push(`/product?_id=${p.product._id}`)}
        >
          {p.product.name}
        </Item.Header>
      ),
      image: p.product.mediaUrl,
      meta: `${p.quantity} x $${p.product.price}`,
      fluid: 'true',
      extra: (
        <Button
          basic
          icon="remove"
          floated="right"
          onClick={() => handleRemoveFromCart(p.product._id)}
        />
      ),
    }));
  };

  return <Item.Group divided items={mapCartProductsToItems(products)} />;
}

export default CartItemList;
