export default class View {
  private element: HTMLElement;

  constructor(tagName: string, className?: string) {
    this.element = document.createElement(tagName);

    if (className) this.element.classList.add(className);
  }

  getElement() {
    return this.element;
  }
}
