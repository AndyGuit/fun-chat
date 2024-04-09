import View from './View';

export default class LoginView extends View {
  constructor() {
    super('div');

    this.getElement().textContent = 'Login View';
  }
}
