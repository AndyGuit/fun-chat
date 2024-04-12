import UserState from '../store/UserState';
import { IUserAuthRequest, IUserLogoutRequest, MessageTypes } from '../types/apiInterfaces';
import { generateId } from '../utils/functions';
import { API_URL } from '../utils/globalVariables';

export default class SocketApi {
  private ws: WebSocket;

  private userState: UserState;

  constructor(userState: UserState) {
    this.ws = new WebSocket(API_URL);

    this.userState = userState;

    this.ws.addEventListener('open', this.handleOpen.bind(this));
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

  addMessageListener(callback: (e: MessageEvent<string>) => void) {
    this.ws.addEventListener('message', callback);
  }

  removeMessageListener(callback: (e: MessageEvent<string>) => void) {
    this.ws.removeEventListener('message', callback);
  }
}
