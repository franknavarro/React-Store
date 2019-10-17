import { parseCookies } from 'nookies';

import axiosBase from '../utils/axiosBase';
import AccountHeader from '../components/Account/AccountHeader';
import AccountOrders from '../components/Account/AccountOrders';
import AccountPermissions from '../components/Account/AccountPermissions';

const Account = ({ user, orders }) => {
  return (
    <>
      <AccountHeader {...user} />
      <AccountOrders orders={orders} />
      {user.role === 'root' && <AccountPermissions currentUserId={user._id} />}
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
