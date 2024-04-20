import { ROUTE_PATH } from '../../utils/globalVariables';
import Button from '../Button/Button';
import Link from '../Link/Link';
import './Header.css';

interface Props {
  userName: string;
  onLogout: () => void;
  onClickAbout: () => void;
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

  const controlsWrapper = document.createElement('div');
  controlsWrapper.classList.add('header-controls');

  const aboutLink = Link({ href: ROUTE_PATH.about, text: 'About', onClick: props.onClickAbout });

  const logoutButton = Button({
    text: 'Logout',
    classNames: 'button',
    type: 'button',
    onClick: props.onLogout,
  });

  controlsWrapper.append(aboutLink, logoutButton);
  element.append(h2, h1, controlsWrapper);
  return element;
}
