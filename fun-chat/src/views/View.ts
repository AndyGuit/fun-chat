import Button from '../components/Button/Button';

export default class View {
  private element: HTMLElement;

  private overlay: HTMLElement;

  private modal: HTMLElement;

  constructor(tagName: string, className?: string) {
    this.element = document.createElement(tagName);
    this.overlay = document.createElement('div');

    this.modal = document.createElement('div');

    if (className) this.element.classList.add(className);

    this.createModal();
    this.renderModal();
  }

  getElement() {
    return this.element;
  }

  createModal() {
    this.overlay.classList.add('modal-overlay', 'hidden');
    this.modal.classList.add('modal-window');

    const modalTextElement = document.createElement('p');
    const button = Button({
      classNames: 'button',
      text: 'OK',
      type: 'button',
      onClick: this.hideModal.bind(this),
    });

    this.modal.append(modalTextElement, button);
    this.overlay.append(this.modal);
  }

  showModal(modalText: string) {
    const modalTextElement = this.modal.firstElementChild;

    if (modalTextElement) {
      modalTextElement.textContent = `Error: ${modalText}`;
    }

    this.overlay.classList.remove('hidden');
  }

  hideModal() {
    this.overlay.classList.add('hidden');
  }

  renderModal() {
    document.body.append(this.overlay);
  }
}
