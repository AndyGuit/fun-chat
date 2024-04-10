import Button from '../components/Button/Button';
import InputField from '../components/InputField/InputField';
import View from './View';

export default class LoginView extends View {
  constructor() {
    super('form');

    this.render();
  }

  render() {
    // const button = Button({ text: 'login', type: 'submit', classNames: 'button' });
    const inputName = InputField({
      type: 'text',
      placeholder: 'Enter your name',
      value: '',
      id: 'Name',
    });
    const inputPassword = InputField({
      type: 'password',
      placeholder: 'Enter your password',
      value: '',
      id: 'Password',
    });

    this.getElement().append(inputName, inputPassword);
    this.getElement().addEventListener('submit', this.handleLogin.bind(this));
  }

  handleLogin(e: SubmitEvent) {
    e.preventDefault();
  }
}
