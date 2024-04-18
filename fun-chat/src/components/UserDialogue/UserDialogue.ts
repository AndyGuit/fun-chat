import { IMessage, ISendMessageRequest, IUser, MessageTypes } from '../../types/apiInterfaces';
import { generateId, removeChildElements } from '../../utils/functions';
import Button from '../Button/Button';
import ContextMenu from '../ContextMenu/ContextMenu';
import Input from '../Input/Input';
import MessageCard from '../MessageCard/MessageCard';
import './UserDialogue.css';

interface Props {
  senderName: string;
  handleSendMessage: (data: ISendMessageRequest) => void;
  handleChangeMessageToReaded: (id: string) => void;
  handleDeleteMessage: (messageId: string) => void;
  handleEditMessage: (messageId: string, text: string) => void;
}

export default function UserDialogue(props: Props) {
  const container = document.createElement('div');
  container.classList.add('user-dialogue-container');

  const header = document.createElement('header');
  header.classList.add('user-dialogue-header');
  const selectedUserName = document.createElement('h3');
  const selectedUserStatus = document.createElement('h4');
  header.append(selectedUserName, selectedUserStatus);

  const contextMenu = ContextMenu();
  const form = document.createElement('form');
  form.classList.add('user-dialogue-form');
  const dialogueChat = document.createElement('div');
  dialogueChat.classList.add('user-dialogue-chat');
  const centerText = document.createElement('div');
  centerText.classList.add('dialogue-text-center');
  centerText.textContent = 'Select user to start chating';
  dialogueChat.append(centerText);

  const unreadMessagesSeparator = document.createElement('div');
  unreadMessagesSeparator.classList.add('new-messages');
  unreadMessagesSeparator.textContent = 'New Messages';

  const input = Input({
    classNames: 'input',
    type: 'text',
    value: '',
  });
  input.setAttribute('disabled', 'true');
  const button = Button({
    classNames: 'button',
    text: 'Send',
    type: 'submit',
    disabled: true,
  });

  form.append(input, button);

  let ignoreScroll = true;
  let unreadMessages: IMessage[] = [];

  function handleReadMessage() {
    if (ignoreScroll || !unreadMessages.length) return;
    unreadMessages.forEach((message) => {
      if (message.from !== props.senderName) {
        props.handleChangeMessageToReaded(message.id);
      }
    });
  }

  dialogueChat.addEventListener('click', handleReadMessage);
  dialogueChat.addEventListener('scroll', handleReadMessage);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const messageToEditId = form.getAttribute('data-message-edit-id');

    if (input.value.trim() === '') {
      input.classList.add('invalid');
      return;
    }

    if (messageToEditId) {
      props.handleEditMessage(messageToEditId, input.value);
      form.removeAttribute('data-message-edit-id');
      input.value = '';
      input.classList.remove('invalid');
      return;
    }

    handleReadMessage();

    props.handleSendMessage({
      id: generateId(),
      type: MessageTypes.MSG_SEND,
      payload: {
        message: {
          text: input.value,
          to: selectedUserName.textContent!,
        },
      },
    });

    input.value = '';
    input.classList.remove('invalid');
  });

  function removeContextMenu(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const messageId = target.parentElement?.parentElement?.getAttribute('data-id');
    const messageText = target.parentElement?.parentElement?.getAttribute('data-text');

    if (target.classList.contains('edit')) {
      if (messageText) input.value = messageText;
      if (messageId) form.setAttribute('data-message-edit-id', messageId);

      console.log('edit message');
    }

    if (target.classList.contains('delete')) {
      if (messageId) props.handleDeleteMessage(messageId);
    }

    contextMenu.remove();
    document.body.removeEventListener('click', removeContextMenu);
  }

  container.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    const target = e.target as HTMLElement;

    const messageCardElement = target.closest('.message-card');

    if (!messageCardElement) return;
    if (!messageCardElement.classList.contains('from-sender')) return;

    messageCardElement.append(contextMenu);

    document.body.addEventListener('click', removeContextMenu);
  });

  function handleDialogue(user: IUser) {
    selectedUserName.textContent = user.login;
    setUserDialogueStatus(user.isLogined);
    button.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.placeholder = 'Your message';
  }

  function setUserDialogueStatus(isLogined: boolean) {
    selectedUserStatus.textContent = isLogined ? 'Online' : 'Offline';
    selectedUserStatus.className = isLogined ? 'active' : 'inactive';
  }

  function renderMessagesHistory(messages: IMessage[]) {
    ignoreScroll = true;
    removeChildElements(dialogueChat);

    let firstNewMessageIndex = -1;

    if (messages.length === 0) {
      dialogueChat.append(centerText);
      centerText.textContent = 'Write your first message.';
      return;
    }

    unreadMessages = messages.filter((msg) => !msg.status.isReaded);

    const messageElements = messages.map((msg, index) => {
      if (!msg.status.isReaded && msg.from !== props.senderName) {
        firstNewMessageIndex = firstNewMessageIndex > -1 ? firstNewMessageIndex : index;
      }

      return MessageCard({
        id: msg.id,
        datetime: msg.datetime,
        text: msg.text,
        from: msg.from === props.senderName ? 'You' : msg.from,
        status: msg.status,
      });
    });

    if (firstNewMessageIndex > -1) {
      messageElements.splice(firstNewMessageIndex, 0, unreadMessagesSeparator);
    }

    dialogueChat.append(...messageElements);
    dialogueChat.scrollTo(0, dialogueChat.scrollHeight);
    setTimeout(() => {
      ignoreScroll = false;
    }, 100);
  }

  function addNewMessage(message: IMessage) {
    centerText.remove();
    const card = MessageCard({
      id: message.id,
      datetime: message.datetime,
      text: message.text,
      from: message.from === props.senderName ? 'You' : message.from,
      status: message.status,
    });
    if (message.from !== props.senderName) {
      unreadMessages.push(message);
      dialogueChat.append(unreadMessagesSeparator);
    }
    ignoreScroll = true;
    dialogueChat.append(card);
    dialogueChat.scrollTo(0, dialogueChat.scrollHeight);
    setTimeout(() => {
      ignoreScroll = false;
    }, 100);
  }

  container.append(header, dialogueChat, form);
  return {
    element: container,
    handleDialogue,
    renderMessagesHistory,
    addNewMessage,
    setUserDialogueStatus,
  };
}
