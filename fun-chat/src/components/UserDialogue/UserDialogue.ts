import { IMessage, ISendMessageRequest, IUser, MessageTypes } from '../../types/apiInterfaces';
import { generateId } from '../../utils/functions';
import Button from '../Button/Button';
import Input from '../Input/Input';
import './UserDialogue.css';

interface Props {
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
  dialogueChat.textContent = 'Select user to start chating';

  const input = Input({
    classNames: 'input',
    type: 'text',
    value: '',
  });
  input.setAttribute('disabled', 'true');
  const button = Button({ classNames: 'button', text: 'Send', type: 'submit', disabled: true });

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
    dialogueChat.textContent = '';
    dialogueChat.classList.add('dialog-started');

    selectedUserName.textContent = user.login;
    selectedUserStatus.textContent = user.isLogined ? 'Online' : 'Offline';
    selectedUserStatus.className = user.isLogined ? 'active' : 'inactive';
    button.removeAttribute('disabled');
    input.removeAttribute('disabled');
    input.placeholder = 'Your message';
  }

  function renderMessagesHistory(messages: IMessage[]) {
    const messageElements = messages.map((msg) => {
      const div = document.createElement('div');
      div.textContent = msg.text;

      return div;
    });

    console.log(messages);

    dialogueChat.append(...messageElements);
  }

  container.append(header, dialogueChat, form);
  return {
    element: container,
    handleDialogue,
    renderMessagesHistory,
  };
}
