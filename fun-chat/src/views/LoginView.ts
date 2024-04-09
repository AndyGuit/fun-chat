import Button from '../components/Button/Button';
import View from './View';

export default class LoginView extends View {
  constructor() {
    super('form');

    this.render();
  }

  render() {
    const button = Button({ text: 'login', type: 'submit', classNames: 'button' });

    this.getElement().append(button);
    this.getElement().addEventListener('submit', this.handleSubmitForm.bind(this));
  }

  handleSubmitForm(e: SubmitEvent) {
    e.preventDefault();
  }
}
