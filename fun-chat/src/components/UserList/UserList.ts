import './UserList.css';
import { IUser } from '../../types/apiInterfaces';

interface Props {
  users: Array<IUser>;
  currentUserName: string;
}

export function UserList(props: Props) {
  const container = document.createElement('div');
  container.classList.add('user-list-container');

  const ul = document.createElement('ul');
  ul.classList.add('user-list');

  const liItem = props.users
    .filter((user) => user.login !== props.currentUserName)
    .map((user) => {
      const li = document.createElement('li');
      const activeClass = user.isLogined ? 'active' : 'inactive';
      li.classList.add('user-list-item', activeClass);
      li.textContent = user.login;

      return li;
    });

  ul.append(...liItem);
  container.append(ul);
  return container;
}
