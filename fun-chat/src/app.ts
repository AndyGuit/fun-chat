import Router from './router/Router';
import { IRoute } from './types/interfaces';
import { ROUTE_PATH } from './utils/globalVariables';
import AboutView from './views/AboutView';
import ChatView from './views/ChatView';
import LoginView from './views/LoginView';

export default class App {
  private appElement: HTMLElement;

  private loginView: LoginView;

  private aboutView: AboutView;

  private chatView: ChatView;

  private router: Router;

  constructor() {
    this.appElement = document.createElement('div');
    this.appElement.setAttribute('id', 'app');

    this.loginView = new LoginView();
    this.aboutView = new AboutView();
    this.chatView = new ChatView();

    this.router = new Router(this.createRoutes());
  }

  createRoutes() {
    const routes: IRoute[] = [
      {
        path: ROUTE_PATH.index,
        callback: () => {
          this.renderView(this.loginView);
        },
      },
      {
        path: ROUTE_PATH.login,
        callback: () => {
          this.renderView(this.loginView);
        },
      },
      {
        path: ROUTE_PATH.about,
        callback: () => {
          this.renderView(this.aboutView);
        },
      },
      {
        path: ROUTE_PATH.chat,
        callback: () => {
          this.renderView(this.chatView);
        },
      },
    ];

    return routes;
  }

  renderView(view: LoginView | ChatView | AboutView) {
    while (this.appElement.firstElementChild) {
      this.appElement.firstElementChild.remove();
    }

    this.appElement.append(view.getElement());
  }

  init() {
    this.appElement.append(this.loginView.getElement());

    document.body.append(this.appElement);
  }
}
