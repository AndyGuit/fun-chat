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
  ISendMessageRequest,
  ISendMessageResponse,
  IMessageHistoryResponse,
  IMessageReadStatusChangeResponse,
  IMessage,
  IMessageDeleteRequest,
  IMessageDeleteResponse,
  IMessageEditRequest,
  IMessageEditResponse,
  IExternalUserSessionResponse,
} from '../../types/apiInterfaces';
import Footer from '../../components/Footer/Footer';
import UserList from '../../components/UserList/UserList';
import { generateId } from '../../utils/functions';
import UserDialogue from '../../components/UserDialogue/UserDialogue';

export default class ChatView extends View {
  private router: Router;

  private api: SocketApi;

  private userListElement: ReturnType<typeof UserList>;

  private userDialogueElement: ReturnType<typeof UserDialogue>;

  private userList: IUser[];

  private userMessages: IMessage[];

  private userState: UserState;

  constructor(router: Router, api: SocketApi, userState: UserState) {
    super('div', 'chat');

    this.router = router;
    this.api = api;
    this.userState = userState;
    this.userMessages = [];
    this.userList = [];

    this.userListElement = UserList({
      users: this.userList,
      currentUserName: this.userState.getName(),
      handleSearchUser: this.searchUsers.bind(this),
      handleClickUser: this.startDialogue.bind(this),
    });

    this.userDialogueElement = UserDialogue({
      senderName: this.userState.getName(),
      handleSendMessage: this.sendMessage.bind(this),
      handleChangeMessageToReaded: this.changeMessageStatusToReaded.bind(this),
      handleDeleteMessage: this.deleteMessage.bind(this),
      handleEditMessage: this.editMessage.bind(this),
    });

    if (this.api.getStatus() === ReadyStateStatus.CONNETCING) {
      this.api.addOpenListener(this.requestUsers.bind(this));
    } else {
      this.requestUsers();
    }

    this.addApiListeners();
    this.render();
  }

  addApiListeners() {
    this.api.addMessageListener(this.externalUserSessionListener.bind(this));
    this.api.addMessageListener(this.editMessageListener.bind(this));
    this.api.addMessageListener(this.deleteMessageListener.bind(this));
    this.api.addMessageListener(this.messageToReadedStatusListener.bind(this));
    this.api.addMessageListener(this.messagesHistoryListener.bind(this));
    this.api.addMessageListener(this.getMessageListener.bind(this));
    this.api.addMessageListener(this.getUsersListener.bind(this));
    this.api.addMessageListener(this.logoutListener.bind(this));
  }

  render() {
    const header = Header({
      userName: this.userState.getName(),
      onLogout: this.handleLogout.bind(this),
    });

    const main = document.createElement('main');

    main.append(this.userListElement.element, this.userDialogueElement.element);

    const footer = Footer();

    this.getElement().append(header, main, footer);
  }

  sendMessage(data: ISendMessageRequest) {
    this.api.send(data);
  }

  deleteMessage(messageId: string) {
    const data: IMessageDeleteRequest = {
      id: generateId(),
      type: MessageTypes.MSG_DELETE,
      payload: {
        message: {
          id: messageId,
        },
      },
    };
    this.api.send(data);
  }

  editMessage(messageId: string, text: string) {
    const data: IMessageEditRequest = {
      id: generateId(),
      type: MessageTypes.MSG_EDIT,
      payload: {
        message: {
          id: messageId,
          text,
        },
      },
    };
    this.api.send(data);
  }

  requestUsers() {
    this.api.send({ id: generateId(), payload: null, type: MessageTypes.USER_ACTIVE });
    this.api.send({ id: generateId(), payload: null, type: MessageTypes.USER_INACTIVE });
  }

  handleLogout() {
    this.api.logout({ name: this.userState.getName(), password: this.userState.getPassword() });
  }

  changeMessageStatusToReaded(messageId: string) {
    this.api.send({
      type: MessageTypes.MSG_READ,
      id: generateId(),
      payload: {
        message: {
          id: messageId,
        },
      },
    });
  }

  startDialogue(user: IUser) {
    this.api.send({
      id: generateId(),
      type: MessageTypes.MSG_FROM_USER,
      payload: {
        user: {
          login: user.login,
        },
      },
    });
    this.userState.dialogingWith = user.login;
    this.userDialogueElement.handleDialogue(user);
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
      this.userList = [...this.userList, ...data.payload.users];
    }

    if (data.type === MessageTypes.USER_INACTIVE) {
      this.userList = [...this.userList, ...data.payload.users];
      this.userListElement.renderUsers(this.userList);
    }
  }

  getMessageListener(e: MessageEvent<string>) {
    const data: ISendMessageResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_SEND) {
      if (
        data.payload.message.from === this.userState.getName() ||
        data.payload.message.from === this.userState.dialogingWith
      ) {
        this.userMessages.push(data.payload.message);
        this.userDialogueElement.addNewMessage(data.payload.message);
      }
    }
  }

  messagesHistoryListener(e: MessageEvent<string>) {
    const data: IMessageHistoryResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_FROM_USER) {
      this.userMessages = data.payload.messages;
      this.userDialogueElement.renderMessagesHistory(data.payload.messages);
    }
  }

  messageToReadedStatusListener(e: MessageEvent<string>) {
    const data: IMessageReadStatusChangeResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_READ) {
      this.userMessages = this.userMessages.map((msg) => {
        return { ...msg, status: { ...msg.status, isReaded: true } };
      });

      this.userDialogueElement.renderMessagesHistory(this.userMessages);
    }
  }

  editMessageListener(e: MessageEvent<string>) {
    const data: IMessageEditResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_EDIT) {
      if (data.payload.message.status.isEdited) {
        this.userMessages = this.userMessages.map((message) => {
          if (message.id === data.payload.message.id) {
            return {
              ...message,
              status: {
                ...message.status,
                isEdited: data.payload.message.status.isEdited,
              },
              text: data.payload.message.text,
            };
          }
          return message;
        });

        this.userDialogueElement.renderMessagesHistory(this.userMessages);
      }
    }
  }

  deleteMessageListener(e: MessageEvent<string>) {
    const data: IMessageDeleteResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_DELETE) {
      if (data.payload.message.status.isDeleted) {
        this.userMessages = this.userMessages.filter((message) => {
          return message.id !== data.payload.message.id;
        });

        this.userDialogueElement.renderMessagesHistory(this.userMessages);
      }
    }
  }

  externalUserSessionListener(e: MessageEvent<string>) {
    const data: IExternalUserSessionResponse = JSON.parse(e.data);

    if (
      data.type === MessageTypes.USER_EXTERNAL_LOGIN ||
      data.type === MessageTypes.USER_EXTERNAL_LOGOUT
    ) {
      console.log(data.type);
      console.log(data);
      this.userList = this.userList.map((user) => {
        if (data.payload.user.login === user.login) {
          user.isLogined = data.payload.user.isLogined;
        }
        return user;
      });
      console.log(JSON.stringify(this.userList));
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
      console.error(data);
    }
  }
}
