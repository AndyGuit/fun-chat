import './LoginView.css';
import AuthFieldset from '../../components/AuthFieldset/AuthFieldset';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import Link from '../../components/Link/Link';
import { ROUTE_PATH } from '../../utils/globalVariables';
import View from '../View';
import Router from '../../router/Router';

export default class LoginView extends View {
  private router: Router;
  constructor(router: Router) {
    super('form');

    this.router = router;

    this.render();
  }

  render() {
    const button = Button({ text: 'Login', type: 'submit', classNames: 'button' });
    const inputName = InputField({
      type: 'text',
      placeholder: 'Enter name',
      value: '',
      id: 'Name',
    });
    const inputPassword = InputField({
      type: 'password',
      placeholder: 'Enter password',
      value: '',
      id: 'Password',
    });

    const fieldset = AuthFieldset({ legendText: 'Authorization', inputs: [inputName, inputPassword] });

    const infoLink = Link({
      text: 'About the app',
      href: ROUTE_PATH.about,
      onClick: () => this.router.navigate(ROUTE_PATH.about),
    });

    const controlsGroup = document.createElement('div');
    controlsGroup.classList.add('form-controls');
    controlsGroup.append(infoLink, button);

    this.getElement().append(fieldset, controlsGroup);
    this.getElement().addEventListener('submit', this.handleLogin.bind(this));
  }

  handleLogin(e: SubmitEvent) {
    e.preventDefault();
  }
}
