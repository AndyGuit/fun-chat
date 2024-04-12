import UserState from '../store/UserState';
import {
  IUserAuthRequest,
  IUserLogoutRequest,
  MessageTypes,
  TServerResponses,
} from '../types/apiInterfaces';
import { deleteLoginData, generateId, saveLoginData } from '../utils/functions';
import { API_URL } from '../utils/globalVariables';

export default class SocketApi {
  private ws: WebSocket;

  private userState: UserState;

  constructor(userState: UserState) {
    this.ws = new WebSocket(API_URL);

    this.userState = userState;

    this.ws.addEventListener('open', this.handleOpen.bind(this));
    this.ws.addEventListener('message', this.handleMessage.bind(this));
  }

  login(data: { name: string; password: string }) {
    const requestData: IUserAuthRequest = {
      id: generateId(),
      type: MessageTypes.USER_LOGIN,
      payload: {
        user: {
          login: data.name,
          password: data.password,
        },
      },
    };

    this.ws.send(JSON.stringify(requestData));
  }

  logout(data: { name: string; password: string }) {
    const requestData: IUserLogoutRequest = {
      id: generateId(),
      type: MessageTypes.USER_LOGOUT,
      payload: {
        user: {
          login: data.name,
          password: data.password,
        },
      },
    };

    this.ws.send(JSON.stringify(requestData));
  }

  handleOpen() {
    if (this.userState.isLoggedIn) {
      this.login({ name: this.userState.getName(), password: this.userState.getPassword() });
    }
  }

  handleMessage(e: MessageEvent<string>) {
    const data: TServerResponses = JSON.parse(e.data);

    if (data.type === MessageTypes.USER_LOGIN) {
      saveLoginData({ name: this.userState.getName(), password: this.userState.getPassword() });
    }

    if (data.type === MessageTypes.USER_LOGOUT) {
      deleteLoginData();
    }

    if (data.type === MessageTypes.ERROR) {
      console.log('ERROR');
      console.error(data);
    }
  }
}
