import './InputField.css';
import Input from '../Input/Input';

interface Props {
  type: 'text' | 'password';
  value: string;
  invalidText: string;
  validateFn: (value: string) => boolean;
  id?: string;
  onChange?: () => void;
  placeholder?: string;
}

export default function InputField(props: Props) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('input-field');

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('input-wrapper');

  const label = document.createElement('label');
  label.classList.add('input-label');

  const invalidText = document.createElement('span');
  invalidText.classList.add('invalid-text');
  invalidText.textContent = props.invalidText;

  if (props.id) {
    label.textContent = props.id;
    label.setAttribute('for', props.id);
  }

  const { type, value, id, placeholder } = props;

  const handleValidate = () => {
    const isValid = props.validateFn(input.value);

    if (isValid) wrapper.classList.remove('invalid');
    if (!isValid) wrapper.classList.add('invalid');
  };

  const input = Input({
    type,
    value,
    id,
    onInput: handleValidate,
    placeholder,
    classNames: 'input',
  });

  inputWrapper.append(input, invalidText);
  wrapper.append(label, inputWrapper);

  return wrapper;
}
