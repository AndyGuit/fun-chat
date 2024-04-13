import './ChatView.css';
import SocketApi from '../../api/Api';
import Header from '../../components/Header/Header';
import Router from '../../router/Router';
import UserState from '../../store/UserState';
import View from '../View';
import { ROUTE_PATH } from '../../utils/globalVariables';
import { MessageTypes, TLogoutResponse } from '../../types/apiInterfaces';
import Footer from '../../components/Footer/Footer';
import { UserList } from '../../components/UserList/UserList';

export default class ChatView extends View {
  private router: Router;

  private api: SocketApi;

  private userState: UserState;

  constructor(router: Router, api: SocketApi, userState: UserState) {
    super('div', 'chat');

    this.router = router;

    this.api = api;

    this.userState = userState;

    this.api.addMessageListener(this.logoutListener.bind(this));
    this.render();
  }

  render() {
    const header = Header({
      userName: this.userState.getName(),
      onLogout: this.handleLogout.bind(this),
    });

    const main = document.createElement('main');

    const usersList = UserList({
      users: [
        {
          login: 'Aaaaa',
          isLogined: true,
        },
        {
          login: 'Bbbb',
          isLogined: false,
        },
        {
          login: 'Ccccc',
          isLogined: true,
        },
      ],
      currentUserName: 'Aaaaa',
    });

    main.append(usersList);

    const footer = Footer();

    this.getElement().append(header, main, footer);
  }

  handleLogout() {
    this.api.logout({ name: this.userState.getName(), password: this.userState.getPassword() });
  }

  logoutListener(e: MessageEvent<string>) {
    const data: TLogoutResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.USER_LOGOUT) {
      this.userState.setName('');
      this.userState.setPassword('');
      this.userState.isLoggedIn = data.payload.user.isLogined;

      this.router.navigate(ROUTE_PATH.login);
    }

    if (data.type === MessageTypes.ERROR) {
      console.log(data);
    }
  }
}
