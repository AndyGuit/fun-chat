import './MessageCard.css';

interface Props {
  text: string;
}

export default function MessageCard(props: Props) {
  const element = document.createElement('div');
  element.classList.add('message-card');

  const header = document.createElement('header');
  const senderName = document.createElement('div');
  const sendDate = document.createElement('div');
  senderName.textContent = 'Name';
  sendDate.textContent = 'Date';
  header.append(senderName, sendDate);

  const footer = document.createElement('footer');
  const messageStatus = document.createElement('div');
  messageStatus.textContent = 'Status';
  footer.append(messageStatus);

  const textElement = document.createElement('div');
  textElement.classList.add('message-text');
  textElement.textContent = props.text;

  console.log(props);

  element.append(header, textElement, footer);
  return element;
}
