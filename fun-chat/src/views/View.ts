export default class View {
  private element: HTMLElement;

  private className: string;

  constructor(tagName: string, className?: string) {
    this.element = document.createElement(tagName);

    if (className) this.element.classList.add(className);
  }

  getElement() {
    return this.element;
  }
}
