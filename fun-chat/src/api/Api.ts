import UserState from '../store/UserState';
import { IUserAuthRequest, MessageTypes, TServerResponses } from '../types/apiInterfaces';
import { generateId, saveLoginData } from '../utils/functions';
import { API_URL } from '../utils/globalVariables';

export default class SocketApi {
  private ws: WebSocket;

  private userState: UserState;

  constructor(userState: UserState) {
    this.ws = new WebSocket(API_URL);

    this.userState = userState;

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

    console.log(requestData);

    this.ws.send(JSON.stringify(requestData));
  }

  handleMessage(e: MessageEvent<string>) {
    const data: TServerResponses = JSON.parse(e.data);

    if (data.type === MessageTypes.USER_LOGIN) {
      saveLoginData({ name: this.userState.getName(), password: this.userState.getPassword() });

      console.log(data);
    }
  }
}
