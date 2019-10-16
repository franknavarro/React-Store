import { parseCookies } from 'nookies';

import axiosBase from '../utils/axiosBase';
import AccountHeader from '../components/Account/AccountHeader';
import AccountOrders from '../components/Account/AccountOrders';

const Account = ({ user, orders }) => {
  console.log({ orders });
  return (
    <>
      <AccountHeader {...user} />
      <AccountOrders orders={orders} />
    </>
  );
};

Account.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { orders: [] };
  }
  const payload = { headers: { Authorization: token } };
  const response = await axiosBase.get('/orders', payload);
  return response.data;
};

export default Account;
