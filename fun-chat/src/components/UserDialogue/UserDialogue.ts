import { IUser } from '../../types/apiInterfaces';
import Button from '../Button/Button';
import Input from '../Input/Input';
import './UserDialogue.css';

interface Props {}

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
    placeholder: 'Your message',
  });
  input.setAttribute('disabled', 'true');
  const button = Button({ classNames: 'button', text: 'Send', type: 'submit', disabled: true });

  form.append(input, button);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(input.value);
    input.value = '';
  });

  function handleDialogue(user: IUser) {
    dialogueChat.textContent = '';
    while (dialogueChat.firstElementChild) {
      dialogueChat.firstElementChild.remove();
    }

    selectedUserName.textContent = user.login;
    selectedUserStatus.textContent = user.isLogined ? 'Online' : 'Offline';
    selectedUserStatus.className = user.isLogined ? 'active' : 'inactive';
  }

  container.append(header, dialogueChat, form);
  return {
    element: container,
    handleDialogue,
  };
}
