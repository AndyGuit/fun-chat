import Modal from '../components/Modal/Modal';

export default class View {
  private element: HTMLElement;

  private modalComponent: ReturnType<typeof Modal>;

  constructor(tagName: string, className?: string) {
    this.element = document.createElement(tagName);

    this.modalComponent = Modal(this.getElement());

    if (className) this.element.classList.add(className);
  }

  getElement() {
    return this.element;
  }

  showModal(modalText: string) {
    this.modalComponent.showModal(modalText);
  }

  hideModal() {
    this.modalComponent.hideModal();
  }
}
