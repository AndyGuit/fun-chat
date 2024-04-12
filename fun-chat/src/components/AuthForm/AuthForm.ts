import { validatePassword, validateUserName } from '../../utils/functions';
import { ROUTE_PATH } from '../../utils/globalVariables';
import AuthFieldset from '../AuthFieldset/AuthFieldset';
import Button from '../Button/Button';
import InputField from '../InputField/InputField';
import Link from '../Link/Link';

interface Props {
  handleClickInfo: () => void;
  handleSubmit: (e: SubmitEvent) => void;
}

export default function AuthForm(props: Props) {
  const form = document.createElement('form');

  const button = Button({ text: 'Login', type: 'submit', classNames: 'button' });
  const inputName = InputField({
    type: 'text',
    placeholder: 'Enter name',
    value: '',
    id: 'Name',
    validateFn: validateUserName,
    invalidText: 'Name should be at least 3 characters',
  });
  const inputPassword = InputField({
    type: 'password',
    placeholder: 'Enter password',
    value: '',
    id: 'Password',
    validateFn: validatePassword,
    invalidText: 'Min 4 characters and contain digits',
  });

  const fieldset = AuthFieldset({
    legendText: 'Authorization',
    inputs: [inputName, inputPassword],
  });

  const infoLink = Link({
    text: 'About the app',
    href: ROUTE_PATH.about,
    onClick: () => props.handleClickInfo(),
  });

  const controlsGroup = document.createElement('div');
  controlsGroup.classList.add('form-controls');
  controlsGroup.append(infoLink, button);

  form.addEventListener('submit', props.handleSubmit);

  form.append(fieldset, controlsGroup);
  return form;
}
