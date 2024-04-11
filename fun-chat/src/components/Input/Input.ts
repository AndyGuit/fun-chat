import './Input.css';

interface Props {
  type: 'text' | 'password';
  value: string;
  classNames: string | Array<string>;
  id?: string;
  onInput?: () => void;
  placeholder?: string;
}

export default function Input(props: Props) {
  const element = document.createElement('input');

  element.setAttribute('type', props.type);

  element.setAttribute('value', props.value);

  if (Array.isArray(props.classNames)) {
    element.classList.add(...props.classNames);
  } else {
    element.classList.add(props.classNames);
  }

  if (props.onInput) element.addEventListener('input', props.onInput);

  if (props.placeholder) element.placeholder = props.placeholder;

  if (props.id) element.setAttribute('id', props.id);

  return element;
}
