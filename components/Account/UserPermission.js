import { Table, Checkbox } from 'semantic-ui-react';
import cookie from 'js-cookie';

import axiosBase from '../../utils/axiosBase';

const UserPermision = ({ user }) => {
  const [admin, setAdmin] = React.useState(user.role === 'admin');
  const [disabled, setDisabled] = React.useState(false);
  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    updatePermission();
  }, [admin]);

  const handleChangePermission = () => {
    setAdmin(prevState => !prevState);
  };

  const updatePermission = async () => {
    try {
      setDisabled(true);
      const payload = {
        _id: user._id,
        role: admin ? 'admin' : 'user',
      };
      const headers = { headers: { Authorization: cookie.get('token') } };
      await axiosBase.put('/account', payload, headers);
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox
          toggle
          disabled={disabled}
          checked={admin}
          onChange={handleChangePermission}
        />
      </Table.Cell>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{user.createdAt}</Table.Cell>
      <Table.Cell>{user.updatedAt}</Table.Cell>
      <Table.Cell>{admin ? 'admin' : 'user'}</Table.Cell>
    </Table.Row>
  );
};

export default UserPermision;
