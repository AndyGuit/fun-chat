import './ContextMenu.css';

export default function ContextMenu() {
  const element = document.createElement('ul');
  element.classList.add('context-menu');
  const editElement = document.createElement('li');
  editElement.textContent = 'Edit Message';
  editElement.classList.add('context-menu-item', 'edit');
  const deleteElement = document.createElement('li');
  deleteElement.textContent = 'Delete Message';
  deleteElement.classList.add('context-menu-item', 'delete');

  element.append(editElement, deleteElement);
  return element;
}
