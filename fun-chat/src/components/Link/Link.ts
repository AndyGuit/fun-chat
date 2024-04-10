import './Link.css';

interface Props {
  text: string;
  href: string;
  onClick: () => void;
}

export default function Link(props: Props) {
  const link = document.createElement('a');
  link.classList.add('link');
  link.textContent = props.text;
  link.href = props.href;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    props.onClick();
  });

  return link;
}
