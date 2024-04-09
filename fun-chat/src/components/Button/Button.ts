import './Button.css';

interface Props {
  type: 'button' | 'submit';
  classNames: string | Array<string>;
  text: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
}

export default function Button(props: Props) {
  const element = document.createElement('button');
  element.type = props.type;
  element.textContent = props.text;

  if (Array.isArray(props.classNames)) {
    element.classList.add(...props.classNames);
  } else {
    element.classList.add(props.classNames);
  }

  if (props.onClick) element.addEventListener('click', props.onClick);

  if (props.disabled) element.disabled = true;

  return element;
}
