import AuthFieldset from '../../components/AuthFieldset/AuthFieldset';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import View from '../View';

export default class LoginView extends View {
  constructor() {
    super('form');

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

    this.getElement().append(fieldset, button);
    this.getElement().addEventListener('submit', this.handleLogin.bind(this));
  }

  handleLogin(e: SubmitEvent) {
    e.preventDefault();
  }
}
