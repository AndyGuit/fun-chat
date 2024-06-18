import './AuthFieldset.css';

interface Props {
  legendText: string;
  inputs: Array<HTMLDivElement>;
}

export default function AuthFieldset(props: Props) {
  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('auth-fieldset');
  const legend = document.createElement('legend');
  legend.textContent = props.legendText;

  fieldset.append(legend, ...props.inputs);
  return fieldset;
}
