import {
  Header,
  Accordion,
  Label,
  Segment,
  Icon,
  Button,
  List,
  Image,
} from 'semantic-ui-react';
import { useRouter } from 'next/router';

import formatDate from '../../utils/formatDate';

const AccountOrders = ({ orders }) => {
  const router = useRouter();

  const mapOrderProducts = products => {
    return products.map((p, index) => (
      <>
        <List.Item key={index}>
          <Image avatar src={p.product.mediaUrl} />
          <List.Content>
            <List.Header>{p.product.name}</List.Header>
            <List.Description>
              {p.quantity} x ${p.product.price}
            </List.Description>
          </List.Content>
          <List.Content floated="right">
            <Label tag color="red" size="tiny">
              {p.product.sku}
            </Label>
          </List.Content>
        </List.Item>
      </>
    ));
  };

  const mapOrdersToPanels = orders => {
    return orders.map(order => ({
      key: orders._id,
      title: {
        content: <Label color="blue" content={formatDate(order.createdAt)} />,
      },
      content: {
        content: (
          <>
            <List.Header as="h3">
              Total: ${order.total}
              <Label
                content={order.email}
                icon="mail"
                basic
                horizontal
                style={{ marginLeft: '1em' }}
              />
            </List.Header>
            <List>{mapOrderProducts(order.products)}</List>
          </>
        ),
      },
    }));
  };

  return (
    <>
      <Header as="h2" icon>
        <Icon name="folder open" />
        Order History
      </Header>
      {orders.length === 0 ? (
        <Segment inverted tertiary color="grey" textAlign="center">
          <Header icon>
            <Icon name="copy outline" />
            No past orders.
          </Header>
          <div>
            <Button onClick={() => router.push('/')} color="orange">
              View Products
            </Button>
          </div>
        </Segment>
      ) : (
        <Accordion
          fluid
          styled
          exclusive={false}
          panels={mapOrdersToPanels(orders)}
        />
      )}
    </>
  );
};

export default AccountOrders;
