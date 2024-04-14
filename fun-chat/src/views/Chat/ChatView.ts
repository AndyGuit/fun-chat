import './ChatView.css';
import SocketApi from '../../api/Api';
import Header from '../../components/Header/Header';
import Router from '../../router/Router';
import UserState from '../../store/UserState';
import View from '../View';
import { ROUTE_PATH } from '../../utils/globalVariables';
import {
  ReadyStateStatus,
  IUserActiveResponse,
  IUserInactiveResponse,
  MessageTypes,
  TLogoutResponse,
  IUser,
} from '../../types/apiInterfaces';
import Footer from '../../components/Footer/Footer';
import { UserList } from '../../components/UserList/UserList';
import { generateId } from '../../utils/functions';

export default class ChatView extends View {
  private router: Router;

  private api: SocketApi;

  private userListElement: ReturnType<typeof UserList>;

  private userList: IUser[];

  private userState: UserState;

  constructor(router: Router, api: SocketApi, userState: UserState) {
    super('div', 'chat');

    this.router = router;

    this.api = api;

    this.userState = userState;

    this.userList = [];

    this.userListElement = UserList({
      users: this.userList,
      currentUserName: this.userState.getName(),
      handleSearchUser: this.searchUsers.bind(this),
    });

    if (this.api.getStatus() === ReadyStateStatus.CONNETCING) {
      this.api.addOpenListener(this.requestUsers.bind(this));
    } else {
      this.requestUsers();
    }

    this.api.addMessageListener(this.getUsersListener.bind(this));
    this.api.addMessageListener(this.logoutListener.bind(this));
    this.render();
  }

  render() {
    const header = Header({
      userName: this.userState.getName(),
      onLogout: this.handleLogout.bind(this),
    });

    const main = document.createElement('main');

    main.append(this.userListElement.element);

    const footer = Footer();

    this.getElement().append(header, main, footer);
  }

  requestUsers() {
    this.api.send({ id: generateId(), payload: null, type: MessageTypes.USER_ACTIVE });
    this.api.send({ id: generateId(), payload: null, type: MessageTypes.USER_INACTIVE });
  }

  handleLogout() {
    this.api.logout({ name: this.userState.getName(), password: this.userState.getPassword() });
  }

  searchUsers(e: Event) {
    const target = e.target as HTMLInputElement;
    const searchValue = target.value;

    function filterUsers(user: IUser) {
      if (!searchValue) return true;
      return user.login.toLowerCase().includes(searchValue.toLowerCase());
    }

    this.userListElement.renderUsers(this.userList.filter(filterUsers));
  }

  getUsersListener(e: MessageEvent<string>) {
    const data: IUserActiveResponse | IUserInactiveResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.USER_ACTIVE) {
      console.log('active users: ', data);
      this.userList = [...this.userList, ...data.payload.users];
    }

    if (data.type === MessageTypes.USER_INACTIVE) {
      console.log('inactive users: ', data);
      this.userList = [...this.userList, ...data.payload.users];
      this.userListElement.renderUsers(this.userList);
    }
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
