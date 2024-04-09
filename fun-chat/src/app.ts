import AboutView from './views/AboutView';
import ChatView from './views/ChatView';
import LoginView from './views/LoginView';

export default class App {
  private appElement: HTMLElement;

  private loginView: LoginView;

  private aboutView: AboutView;

  private chatView: ChatView;

  constructor() {
    this.appElement = document.createElement('div');
    this.appElement.setAttribute('id', 'app');

    this.loginView = new LoginView();
    this.aboutView = new AboutView();
    this.chatView = new ChatView();
  }

  init() {
    this.appElement.append(this.loginView.getElement());

    document.body.append(this.appElement);
  }
}
