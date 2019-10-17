import { Table, Checkbox } from 'semantic-ui-react';

const UserPermision = ({ user }) => {
  console.log({ user });
  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox toggle />
      </Table.Cell>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{user.createdAt}</Table.Cell>
      <Table.Cell>{user.updatedAt}</Table.Cell>
      <Table.Cell>{user.role}</Table.Cell>
    </Table.Row>
  );
};

export default UserPermision;
