import './ChatView.css';
import SocketApi from '../../api/Api';
import Header from '../../components/Header/Header';
import Router from '../../router/Router';
import UserState from '../../store/UserState';
import View from '../View';
import { ROUTE_PATH } from '../../utils/globalVariables';
import {
  IUserActiveResponse,
  IUserInactiveResponse,
  MessageTypes,
  TLogoutResponse,
  IUser,
  ISendMessageRequest,
  ISendMessageResponse,
  IMessageHistoryResponse,
  IMessageReadStatusChangeResponse,
  IMessageDeleteRequest,
  IMessageDeleteResponse,
  IMessageEditRequest,
  IMessageEditResponse,
  IExternalUserSessionResponse,
  IDeliveredMessageResponse,
  IUserAuthSuccessResponse,
} from '../../types/apiInterfaces';
import Footer from '../../components/Footer/Footer';
import UserList from '../../components/UserList/UserList';
import { deleteLoginData, generateId, removeChildElements } from '../../utils/functions';
import UserDialogue from '../../components/UserDialogue/UserDialogue';

export default class ChatView extends View {
  private router: Router;

  private api: SocketApi;

  private userListElement!: ReturnType<typeof UserList>;

  private userDialogueElement!: ReturnType<typeof UserDialogue>;

  private userState: UserState;

  constructor(router: Router, api: SocketApi, userState: UserState) {
    super('div', 'chat');

    this.router = router;
    this.api = api;
    this.userState = userState;

    this.addApiListeners();
  }

  addApiListeners() {
    this.api.addCloseListener(this.closeConnectionError.bind(this));
    this.api.addMessageListener(this.loginListener.bind(this));
    this.api.addMessageListener(this.externalUserSessionListener.bind(this));
    this.api.addMessageListener(this.editMessageListener.bind(this));
    this.api.addMessageListener(this.deleteMessageListener.bind(this));
    this.api.addMessageListener(this.messageToReadedStatusListener.bind(this));
    this.api.addMessageListener(this.messageToDeliveredStatusListener.bind(this));
    this.api.addMessageListener(this.messagesHistoryListener.bind(this));
    this.api.addMessageListener(this.getMessageListener.bind(this));
    this.api.addMessageListener(this.getUsersListener.bind(this));
    this.api.addMessageListener(this.logoutListener.bind(this));
  }

  render() {
    this.userListElement = UserList({
      users: this.userState.usersList,
      currentUserName: this.userState.name,
      handleSearchUser: this.searchUsers.bind(this),
      handleClickUser: this.startDialogue.bind(this),
      unreadMessages: this.userState.unreadMessages,
    });

    this.userDialogueElement = UserDialogue({
      senderName: this.userState.name,
      handleSendMessage: this.sendMessage.bind(this),
      handleChangeMessageToReaded: this.changeMessageStatusToReaded.bind(this),
      handleDeleteMessage: this.deleteMessage.bind(this),
      handleEditMessage: this.editMessage.bind(this),
    });

    const header = Header({
      userName: this.userState.name,
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
    this.api.logout({ name: this.userState.name, password: this.userState.getPassword() });
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
    this.userState.dialogingWith = user.login;
    const dialogHistory = this.userState.getUserDialogingWithHistory();
    this.userDialogueElement.handleDialogue(user);
    this.userDialogueElement.renderMessagesHistory(dialogHistory);
  }

  searchUsers(e: Event) {
    const target = e.target as HTMLInputElement;
    const searchValue = target.value;

    function filterUsers(user: IUser) {
      if (!searchValue) return true;
      return user.login.toLowerCase().includes(searchValue.toLowerCase());
    }

    this.userListElement.renderUsers(this.userState.usersList.filter(filterUsers));
  }

  getUsersListener(e: MessageEvent<string>) {
    const data: IUserActiveResponse | IUserInactiveResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.USER_ACTIVE) {
      this.userState.usersList = [...this.userState.usersList, ...data.payload.users];
    }

    if (data.type === MessageTypes.USER_INACTIVE) {
      this.userState.usersList = [...this.userState.usersList, ...data.payload.users];
      this.userListElement.renderUsers(this.userState.usersList);
      this.getAllMessagesHistory();
    }
  }

  getAllMessagesHistory() {
    this.userState.usersList.forEach((user) => {
      if (user.login === this.userState.name) return;

      this.api.send({
        type: MessageTypes.MSG_FROM_USER,
        id: generateId(),
        payload: {
          user: {
            login: user.login,
          },
        },
      });
    });
  }

  getMessageListener(e: MessageEvent<string>) {
    const data: ISendMessageResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_SEND) {
      this.userState.addMessagesToHistory(data.payload.message);

      if (
        data.payload.message.from === this.userState.name ||
        data.payload.message.from === this.userState.dialogingWith
      ) {
        this.userDialogueElement.addNewMessage(data.payload.message);
      }

      this.userState.addUnreadMessage(data.payload.message.from);
      this.userListElement.renderUsers(this.userState.usersList);
    }
  }

  messagesHistoryListener(e: MessageEvent<string>) {
    const data: IMessageHistoryResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_FROM_USER) {
      this.userState.addMessagesToHistory(...data.payload.messages);

      data.payload.messages.forEach((message) => {
        if (!message.status.isReaded) {
          this.userState.addUnreadMessage(message.from);
        }
      });

      this.userListElement.renderUsers(this.userState.usersList);
    }
  }

  messageToDeliveredStatusListener(e: MessageEvent<string>) {
    const data: IDeliveredMessageResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_DELIVER) {
      this.userState.messageStatusToDelivered(data.payload.message.id);
      this.userDialogueElement.renderMessagesHistory(this.userState.getUserDialogingWithHistory());
    }
  }

  messageToReadedStatusListener(e: MessageEvent<string>) {
    const data: IMessageReadStatusChangeResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_READ) {
      this.userState.messageStatusToReaded(data.payload.message.id);
      this.userDialogueElement.renderMessagesHistory(this.userState.getUserDialogingWithHistory());
      this.userState.removeUnreadMessages(this.userState.dialogingWith);
      this.userListElement.renderUsers(this.userState.usersList);
    }
  }

  editMessageListener(e: MessageEvent<string>) {
    const data: IMessageEditResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_EDIT) {
      if (data.payload.message.status.isEdited) {
        const { id, text } = data.payload.message;
        this.userState.editMessageText(id, text);
        const dialoginHistory = this.userState.getUserDialogingWithHistory();
        this.userDialogueElement.renderMessagesHistory(dialoginHistory);
      }
    }
  }

  deleteMessageListener(e: MessageEvent<string>) {
    const data: IMessageDeleteResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.MSG_DELETE) {
      if (data.payload.message.status.isDeleted) {
        this.userState.deleteMessageFromHistory(data.payload.message.id);
        const dialoginHistory = this.userState.getUserDialogingWithHistory();
        this.userDialogueElement.renderMessagesHistory(dialoginHistory);
        // this.userListElement.renderUsers(this.userState.usersList);
      }
    }
  }

  externalUserSessionListener(e: MessageEvent<string>) {
    const data: IExternalUserSessionResponse = JSON.parse(e.data);

    if (
      data.type === MessageTypes.USER_EXTERNAL_LOGIN ||
      data.type === MessageTypes.USER_EXTERNAL_LOGOUT
    ) {
      const isUserInList = this.userState.usersList.some(
        (user) => user.login === data.payload.user.login,
      );

      if (isUserInList) {
        this.userState.usersList = this.userState.usersList.map((user) => {
          if (data.payload.user.login === user.login) {
            user.isLogined = data.payload.user.isLogined;
          }
          return user;
        });
      } else {
        this.userState.usersList.push(data.payload.user);
      }

      if (this.userState.dialogingWith === data.payload.user.login) {
        this.userDialogueElement.setUserDialogueStatus(data.payload.user.isLogined);
      }

      this.userListElement.renderUsers(this.userState.usersList);
    }
  }

  loginListener(e: MessageEvent<string>) {
    const data: IUserAuthSuccessResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.USER_LOGIN) {
      this.userState.isLoggedIn = data.payload.user.isLogined;
      this.userState.name = data.payload.user.login;
      this.requestUsers();
      this.render();
    }
  }

  logoutListener(e: MessageEvent<string>) {
    const data: TLogoutResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.USER_LOGOUT) {
      this.userState.clearState();
      deleteLoginData();

      removeChildElements(this.getElement());

      this.router.navigate(ROUTE_PATH.login);
    }

    if (data.type === MessageTypes.ERROR) {
      this.showModal(data.payload.error);
    }
  }

  closeConnectionError() {
    this.showModal('Oops, we lost connection with server. Please try again later.');
  }
}
