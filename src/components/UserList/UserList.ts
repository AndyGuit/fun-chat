import './UserList.css';
import { IUser } from '../../types/apiInterfaces';
import { removeChildElements } from '../../utils/functions';

interface Props {
  users: Array<IUser>;
  currentUserName: string;
  unreadMessages: Array<{ from: string; numOfMessages: number }>;
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
      const userName = target.getAttribute('data-username');
      const userData: IUser = {
        login: userName || '',
        isLogined: target.classList.contains('active'),
      };

      props.handleClickUser(userData);
    }
  });

  function renderUsers(users: Array<IUser>) {
    removeChildElements(ul);

    const liItem = users
      .filter((user) => user.login !== props.currentUserName)
      .sort((a, b) => Number(b.isLogined) - Number(a.isLogined))
      .map((user) => {
        const isHasUnreadMessages = props.unreadMessages.find(
          (object) => object.from === user.login,
        );

        const unreadMessagesElement = document.createElement('div');
        unreadMessagesElement.classList.add('unread');

        if (isHasUnreadMessages) {
          unreadMessagesElement.classList.add('visible');
          unreadMessagesElement.textContent = isHasUnreadMessages.numOfMessages.toString();
        } else {
          unreadMessagesElement.classList.remove('visible');
        }

        const li = document.createElement('li');
        const activeClass = user.isLogined ? 'active' : 'inactive';
        li.classList.add('user-list-item', activeClass);
        li.setAttribute('data-username', user.login);
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
