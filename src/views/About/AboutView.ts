import './AboutView.css';
import View from '../View';
import Link from '../../components/Link/Link';
import { CREATOR_GITHUB, ROUTE_PATH } from '../../utils/globalVariables';

export default class AboutView extends View {
  constructor() {
    super('div');

    this.render();
  }

  render() {
    const element = this.getElement();
    element.classList.add('about-wrapper');

    const h1 = document.createElement('h1');
    h1.textContent = 'Fun Chat';

    const p = document.createElement('p');
    p.innerHTML = `Welcome to my FunChat Application!
    <br />
    <br />
    This project, developed as an educational endeavor for RS School, leverages WebSockets and TypeScript to deliver real-time communication.
    <br />
    <br />
    The app stores user data only for the current session, so you will need to log in again after ending the current session.
    <br />
    <br />
    The sidebar shows the current registered users, their status (online/offline), and the number of unread messages from each user.
    <br />
    <br />
    The main dialogue window displays messages from users, the name of the message author, the date of sending, and the message status (sent/delivered/read).
    <br />
    <br />
    All the data (messages history, users) are erased from server every 50 minutes.
    <br />
    <br />
    Server application was created by RS School.`;

    const authorLink = document.createElement('a');
    authorLink.setAttribute('href', CREATOR_GITHUB);
    authorLink.classList.add('link');
    authorLink.setAttribute('target', '_blank');
    authorLink.textContent = 'Author Github';

    const goBackLink = Link({
      href: ROUTE_PATH.index,
      text: 'Go back',
      onClick: () => {
        window.history.go(-2);
      },
    });

    const footer = document.createElement('footer');
    footer.classList.add('about-footer');
    footer.append(authorLink, goBackLink);

    element.append(h1, p, footer);
  }
}
