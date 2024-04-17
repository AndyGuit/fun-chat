import ContextMenu from '../ContextMenu/ContextMenu';
import './MessageCard.css';

interface Props {
  id: string;
  text: string;
  from: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}

export default function MessageCard(props: Props) {
  const element = document.createElement('div');
  element.classList.add('message-card');
  element.setAttribute('data-id', props.id);
  const contextMenu = ContextMenu();

  if (props.from === 'You') element.classList.add('from-sender');

  const header = document.createElement('header');
  const senderName = document.createElement('div');
  const sendDate = document.createElement('div');
  senderName.textContent = props.from;
  sendDate.textContent = new Date(props.datetime).toLocaleString('en-GB');
  header.append(senderName, sendDate);

  const footer = document.createElement('footer');
  const messageStatus = document.createElement('div');
  messageStatus.textContent = props.status.isDelivered
    ? props.status.isReaded
      ? 'Readed'
      : 'Delivered'
    : 'Sent';
  footer.append(messageStatus);

  const textElement = document.createElement('div');
  textElement.classList.add('message-text');
  textElement.textContent = props.text;

  function removeContextMenu(e: MouseEvent) {
    const target = e.target as HTMLElement;

    if (target.classList.contains('edit')) {
      console.log('edit message');
    }

    if (target.classList.contains('delete')) {
      console.log('delete message');
    }

    contextMenu.remove();
    document.body.removeEventListener('click', removeContextMenu);
  }

  element.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (props.from !== 'You') return;

    element.append(contextMenu);

    document.body.addEventListener('click', removeContextMenu);
  });

  element.append(header, textElement, footer);
  return element;
}
