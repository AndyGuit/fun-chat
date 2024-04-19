import './Modal.css';
import Button from '../Button/Button';

export default function Modal(rootElement: HTMLElement) {
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay', 'hidden');
  const modal = document.createElement('div');
  modal.classList.add('modal-window');
  const modalTextElement = document.createElement('p');

  function hideModal() {
    overlay.classList.add('hidden');
  }

  function showModal(text: string) {
    modalTextElement.textContent = `Error: ${text}`;
    overlay.classList.remove('hidden');
  }

  const button = Button({
    classNames: 'button',
    text: 'OK',
    type: 'button',
    onClick: hideModal,
  });

  modal.append(modalTextElement, button);
  overlay.append(modal);
  rootElement.append(overlay);

  return {
    element: overlay,
    showModal,
    hideModal,
  };
}
