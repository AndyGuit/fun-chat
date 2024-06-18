import { CREATOR_GITHUB, RS_SCHOOL_LINK, RS_SCHOOL_LOGO_HTML } from '../../utils/globalVariables';
import './Footer.css';

export default function Footer() {
  const element = document.createElement('footer');
  element.classList.add('footer');

  const githubLink = document.createElement('a');
  githubLink.textContent = 'AndyGuit';
  githubLink.classList.add('link');
  githubLink.setAttribute('target', '_blank');
  githubLink.setAttribute('href', CREATOR_GITHUB);

  const schoolLink = document.createElement('a');
  schoolLink.innerHTML = RS_SCHOOL_LOGO_HTML;
  schoolLink.classList.add('link', 'logo');
  schoolLink.setAttribute('target', '_blank');
  schoolLink.setAttribute('href', RS_SCHOOL_LINK);

  const h3 = document.createElement('h3');
  h3.textContent = '2024';

  element.append(schoolLink, githubLink, h3);
  return element;
}
