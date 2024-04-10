import './Input.css';

interface Props {
  type: 'text' | 'password';
  value: string;
  classNames: string | Array<string>;
  id?: string;
  onChange?: () => void;
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

  if (props.onChange) element.addEventListener('change', props.onChange);

  if (props.placeholder) element.placeholder = props.placeholder;

  if (props.id) element.setAttribute('id', props.id);

  return element;
}
