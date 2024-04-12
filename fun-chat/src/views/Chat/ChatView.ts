import './ChatView.css';
import SocketApi from '../../api/Api';
import Header from '../../components/Header/Header';
import Router from '../../router/Router';
import UserState from '../../store/UserState';
import View from '../View';
import { ROUTE_PATH } from '../../utils/globalVariables';

export default class ChatView extends View {
  private router: Router;

  private api: SocketApi;

  private userState: UserState;

  constructor(router: Router, api: SocketApi, userState: UserState) {
    super('div', 'chat');

    this.router = router;

    this.api = api;

    this.userState = userState;

    this.render();
  }

  render() {
    const header = Header({
      userName: this.userState.getName(),
      onLogout: this.handleLogout.bind(this),
    });

    this.getElement().append(header);
  }

  handleLogout() {
    this.api.logout({ name: this.userState.getName(), password: this.userState.getPassword() });

    this.userState.setName('');
    this.userState.setPassword('');
    this.userState.isLoggedIn = false;

    this.router.navigate(ROUTE_PATH.login);
  }
}
