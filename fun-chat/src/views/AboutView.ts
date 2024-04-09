import View from './View';

export default class AboutView extends View {
  constructor() {
    super('div');

    this.getElement().textContent = 'About View';
  }
}
