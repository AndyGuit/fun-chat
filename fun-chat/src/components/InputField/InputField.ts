import './InputField.css';
import Input from '../Input/Input';

interface Props {
  type: 'text' | 'password';
  value: string;
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
  invalidText.textContent = 'Please, enter valid name';

  if (props.id) {
    label.textContent = props.id;
    label.setAttribute('for', props.id);
  }

  const { type, value, id, onChange, placeholder } = props;
  const input = Input({ type, value, id, onChange, placeholder, classNames: 'input' });

  inputWrapper.append(input, invalidText);
  wrapper.append(label, inputWrapper);

  return wrapper;
}
