import { Header, Segment, Button, Icon } from 'semantic-ui-react';

function CartItemList({ user }) {
  const renderUserButton = () => {
    if (user) {
      return <Button color="orange">View Products</Button>;
    } else {
      return <Button color="blue">Login to Add Products</Button>;
    }
  };

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

export default CartItemList;
