export default class View {
  private element: HTMLElement;

  constructor(tagName: string) {
    this.element = document.createElement(tagName);
  }

  getElement() {
    return this.element;
  }
}
