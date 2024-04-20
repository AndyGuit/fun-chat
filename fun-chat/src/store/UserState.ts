import { IMessage, IUser } from '../types/apiInterfaces';
import { getLoginData } from '../utils/functions';

export default class UserState {
  #name: string;

  private password: string;

  unreadMessages: Array<{ from: string; numOfMessages: number }>;

  usersList: Array<IUser>;

  messageHistory: Array<IMessage>;

  dialogingWith: string;

  isLoggedIn: boolean;

  constructor() {
    const loginData = getLoginData();

    if (loginData) {
      this.isLoggedIn = true;
      this.#name = loginData.name;
      this.password = loginData.password;
    } else {
      this.#name = '';
      this.password = '';
      this.isLoggedIn = false;
    }

    this.dialogingWith = '';
    this.usersList = [];
    this.messageHistory = [];
    this.unreadMessages = [];
  }

  getPassword() {
    return this.password;
  }

  setPassword(password: string) {
    this.password = password;
  }

  get name() {
    return this.#name;
  }

  set name(name: string) {
    this.#name = name;
  }

  clearState() {
    this.name = '';
    this.setPassword('');
    this.isLoggedIn = false;
    this.messageHistory = [];
    this.usersList = [];
    this.unreadMessages = [];
  }

  getUserDialogingWithHistory() {
    return this.messageHistory.filter((message) => {
      if (message.from === this.#name && message.to === this.dialogingWith) {
        return true;
      }

      if (message.to === this.#name && message.from === this.dialogingWith) {
        return true;
      }

      return false;
    });
  }

  addUnreadMessage(fromUser: string) {
    if (fromUser === this.#name) return;

    const userIndex = this.unreadMessages.findIndex((user) => user.from === fromUser);

    if (userIndex > -1) {
      this.unreadMessages[userIndex].numOfMessages += 1;
    } else {
      this.unreadMessages.push({ from: fromUser, numOfMessages: 1 });
    }
  }

  decreaseUnreadMessage(fromUser: string) {
    if (fromUser === this.#name) return;

    const userIndex = this.unreadMessages.findIndex((user) => user.from === fromUser);

    if (userIndex === -1) return;

    if (this.unreadMessages[userIndex].numOfMessages === 1) {
      this.unreadMessages.splice(userIndex, 1);
    } else {
      this.unreadMessages[userIndex].numOfMessages -= 1;
    }
  }

  hasUnreadMessagesWithDialoginUser() {
    return !!this.unreadMessages.findIndex((user) => user.from === this.dialogingWith);
  }

  removeUnreadMessages(fromUser: string) {
    const userIndex = this.unreadMessages.findIndex((user) => user.from === fromUser);

    if (userIndex > -1) {
      this.unreadMessages.splice(userIndex, 1);
    }
  }

  addMessagesToHistory(...messages: IMessage[]) {
    this.messageHistory.push(...messages);
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
