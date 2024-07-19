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
  element.setAttribute('data-text', props.text);

  if (props.from === 'You') element.classList.add('from-sender');

  const header = document.createElement('header');
  const senderName = document.createElement('div');
  const sendDate = document.createElement('div');
  senderName.textContent = props.from;
  sendDate.textContent = new Date(props.datetime).toLocaleString('en-GB');
  header.append(senderName, sendDate);

  const footer = document.createElement('footer');

  const messageStatus = document.createElement('div');
  if (props.from === 'You') {
    messageStatus.textContent = 'Sent';
    if (props.status.isDelivered) messageStatus.textContent = 'Delivered';
    if (props.status.isReaded) messageStatus.textContent = 'Read';
  }

  const messageEditedStatus = document.createElement('div');
  if (props.status.isEdited) messageEditedStatus.textContent = 'Edited';
  footer.append(messageEditedStatus, messageStatus);

  const textElement = document.createElement('div');
  textElement.classList.add('message-text');
  textElement.textContent = props.text;

  element.append(header, textElement, footer);
  return element;
}
