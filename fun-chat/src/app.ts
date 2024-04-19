import SocketApi from './api/Api';
import Router from './router/Router';
import UserState from './store/UserState';
import { IRoute } from './types/interfaces';
import { ROUTE_PATH } from './utils/globalVariables';
import AboutView from './views/About/AboutView';
import ChatView from './views/Chat/ChatView';
import LoginView from './views/Login/LoginView';

export default class App {
  private appElement: HTMLElement;

  private router: Router;

  private api: SocketApi;

  private loginView: LoginView;

  private chatView: ChatView;

  private aboutView: AboutView;

  private userState: UserState;

  constructor() {
    this.appElement = document.createElement('div');
    this.appElement.setAttribute('id', 'app');

    this.router = new Router(this.createRoutes());
    this.userState = new UserState();
    this.api = new SocketApi(this.userState);

    this.aboutView = new AboutView();
    this.loginView = new LoginView(this.router, this.api, this.userState);
    this.chatView = new ChatView(this.router, this.api, this.userState);
  }

  createRoutes() {
    const routes: IRoute[] = [
      {
        path: ROUTE_PATH.index,
        callback: () => {
          // this.router.navigate(ROUTE_PATH.login);
          if (this.userState.isLoggedIn) {
            this.router.navigate(ROUTE_PATH.chat);
          } else {
            this.router.navigate(ROUTE_PATH.login);
          }
        },
      },
      {
        path: ROUTE_PATH.login,
        callback: () => {
          if (!this.userState.isLoggedIn) {
            this.renderView(this.loginView);
            // this.renderView(new LoginView(this.router, this.api, this.userState));
          } else {
            this.router.navigate(ROUTE_PATH.chat);
          }
        },
      },
      {
        path: ROUTE_PATH.about,
        callback: () => {
          this.renderView(this.aboutView);
          // this.renderView(new AboutView());
        },
      },
      {
        path: ROUTE_PATH.chat,
        callback: () => {
          if (this.userState.isLoggedIn) {
            this.renderView(this.chatView);
            // this.renderView(new ChatView(this.router, this.api, this.userState));
          } else {
            this.router.navigate(ROUTE_PATH.login);
          }
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
    document.body.append(this.appElement);
  }
}
