import View from './View';

export default class ChatView extends View {
  constructor() {
    super('div');

    this.getElement().textContent = 'Chat View';
  }
}
