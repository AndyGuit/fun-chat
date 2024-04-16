import './MessageCard.css';

interface Props {
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

  element.append(header, textElement, footer);
  return element;
}
