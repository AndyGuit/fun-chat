import { IMessage, IUser } from '../types/apiInterfaces';
import { getLoginData } from '../utils/functions';

export default class UserState {
  private name: string;

  private password: string;

  usersList: Array<IUser>;

  messageHistory: Array<IMessage>;

  dialogingWith: string;

  isLoggedIn: boolean;

  constructor() {
    const loginData = getLoginData();

    if (loginData) {
      this.isLoggedIn = true;
      this.name = loginData.name;
      this.password = loginData.password;
    } else {
      this.name = '';
      this.password = '';
      this.isLoggedIn = false;
    }

    this.dialogingWith = '';
    this.usersList = [];
    this.messageHistory = [];
  }

  setPassword(password: string) {
    this.password = password;
  }

  setName(name: string) {
    this.name = name;
  }

  getPassword() {
    return this.password;
  }

  getName() {
    return this.name;
  }

  getUserDialogingWithHistory() {
    return this.messageHistory.filter((message) => {
      if (message.from === this.getName() && message.to === this.dialogingWith) {
        return true;
      }

      if (message.to === this.getName() && message.from === this.dialogingWith) {
        return true;
      }

      return false;
    });
  }

  addMessageToHistory(message: IMessage) {
    this.messageHistory.push(message);
  }

  messageStatusToDelivered(messageId: string) {
    const messageIndex = this.messageHistory.findIndex((message) => message.id === messageId);

    if (messageIndex > -1) {
      this.messageHistory[messageIndex].status.isDelivered = true;
    }
  }

  messageStatusToReaded(messageId: string) {
    const messageIndex = this.messageHistory.findIndex((message) => message.id === messageId);

    if (messageIndex > -1) {
      this.messageHistory[messageIndex].status.isReaded = true;
    }
  }

  editMessageText(messageId: string, editedText: string) {
    const messageIndex = this.messageHistory.findIndex((message) => message.id === messageId);

    if (messageIndex > -1) {
      this.messageHistory[messageIndex].text = editedText;
      this.messageHistory[messageIndex].status.isEdited = true;
    }
  }

  deleteMessageFromHistory(messageId: string) {
    this.messageHistory = this.messageHistory.filter((message) => message.id !== messageId);
  }
}
