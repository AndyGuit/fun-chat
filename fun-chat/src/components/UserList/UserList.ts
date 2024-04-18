import './UserList.css';
import { IUser } from '../../types/apiInterfaces';

interface Props {
  users: Array<IUser>;
  currentUserName: string;
  handleSearchUser: (e: Event) => void;
  handleClickUser: (user: IUser) => void;
}

export default function UserList(props: Props) {
  const container = document.createElement('aside');
  container.classList.add('user-list-container');

  const searchInput = document.createElement('input');
  searchInput.classList.add('user-search');
  searchInput.placeholder = 'Search...';
  searchInput.setAttribute('type', 'text');
  searchInput.addEventListener('input', props.handleSearchUser);

  const ul = document.createElement('ul');
  ul.classList.add('user-list');

  ul.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('user-list-item')) {
      const userData: IUser = {
        login: target.textContent || '',
        isLogined: target.classList.contains('active'),
      };

      props.handleClickUser(userData);
    }
  });

  function renderUsers(users: Array<IUser>) {
    while (ul.firstElementChild) {
      ul.firstElementChild.remove();
    }

    const liItem = users
      .filter((user) => user.login !== props.currentUserName)
      .sort((a, b) => Number(b.isLogined) - Number(a.isLogined))
      .map((user) => {
        const unreadMessagesElement = document.createElement('div');
        unreadMessagesElement.classList.add('unread');
        // unreadMessagesElement.textContent = '10';

        const li = document.createElement('li');
        const activeClass = user.isLogined ? 'active' : 'inactive';
        li.classList.add('user-list-item', activeClass);
        li.textContent = user.login;

        li.append(unreadMessagesElement);

        return li;
      });
    ul.append(...liItem);
  }

  renderUsers(props.users);

  container.append(searchInput, ul);
  return {
    element: container,
    renderUsers,
  };
}
