import { IMessage, ISendMessageRequest, IUser, MessageTypes } from '../../types/apiInterfaces';
import { generateId, removeChildElements } from '../../utils/functions';
import Button from '../Button/Button';
import Input from '../Input/Input';
import MessageCard from '../MessageCard/MessageCard';
import './UserDialogue.css';

interface Props {
  senderName: string;
  handleSendMessage: (data: ISendMessageRequest) => void;
}

export default function UserDialogue(props: Props) {
  const container = document.createElement('div');
  container.classList.add('user-dialogue-container');

  const header = document.createElement('header');
  header.classList.add('user-dialogue-header');
  const selectedUserName = document.createElement('h3');
  const selectedUserStatus = document.createElement('h4');
  header.append(selectedUserName, selectedUserStatus);

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

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
  });

  function handleDialogue(user: IUser) {
    selectedUserName.textContent = user.login;
    selectedUserStatus.textContent = user.isLogined ? 'Online' : 'Offline';
    selectedUserStatus.className = user.isLogined ? 'active' : 'inactive';
    button.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.placeholder = 'Your message';
  }

  function renderMessagesHistory(messages: IMessage[]) {
    removeChildElements(dialogueChat);

    let firstNewMessageIndex = -1;

    if (messages.length === 0) {
      dialogueChat.append(centerText);
      centerText.textContent = 'Write your first message.';
      return;
    }

    const messageElements = messages.map((msg, index) => {
      if (!msg.status.isReaded) {
        firstNewMessageIndex = firstNewMessageIndex > -1 ? firstNewMessageIndex : index;
      }

      return MessageCard({
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
  }

  function addNewMessage(message: IMessage) {
    centerText.remove();
    const card = MessageCard({
      datetime: message.datetime,
      text: message.text,
      from: message.from === props.senderName ? 'You' : message.from,
      status: message.status,
    });
    dialogueChat.append(card);
    dialogueChat.scrollTo(0, dialogueChat.scrollHeight);
  }

  container.append(header, dialogueChat, form);
  return {
    element: container,
    handleDialogue,
    renderMessagesHistory,
    addNewMessage,
  };
}
