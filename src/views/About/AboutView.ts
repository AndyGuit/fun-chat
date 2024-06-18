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
    p.textContent = "App was developed as a task 'Fun Chat' for 'RS-School' 2024.";

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
