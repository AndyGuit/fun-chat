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

  function renderUsers(users: Array<IUser>) {
    while (ul.firstElementChild) {
      ul.firstElementChild.remove();
    }

    const liItem = users
      .filter((user) => user.login !== props.currentUserName)
      .map((user) => {
        const li = document.createElement('li');
        const activeClass = user.isLogined ? 'active' : 'inactive';
        li.classList.add('user-list-item', activeClass);
        li.textContent = user.login;

        return li;
      });
    ul.append(...liItem);
  }

  renderUsers(props.users);

  container.append(ul);
  return {
    element: container,
    renderUsers,
  };
}
