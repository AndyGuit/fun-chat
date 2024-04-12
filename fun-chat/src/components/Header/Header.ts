import Button from '../Button/Button';
import './Header.css';

interface Props {
  userName: string;
  onLogout: () => void;
}

export default function Header(props: Props) {
  const element = document.createElement('header');
  element.classList.add('header');

  const h2 = document.createElement('h2');
  h2.classList.add('user-name');
  h2.textContent = `User: ${props.userName}`;

  const h1 = document.createElement('h1');
  h1.classList.add('app-name');
  h1.textContent = 'Fun Chat';

  const logoutButton = Button({ text: 'Logout', classNames: 'button', type: 'button', onClick: props.onLogout });

  element.append(h2, h1, logoutButton);
  return element;
}
