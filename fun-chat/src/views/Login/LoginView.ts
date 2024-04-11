import './LoginView.css';
import { ROUTE_PATH } from '../../utils/globalVariables';
import View from '../View';
import Router from '../../router/Router';
import AuthForm from '../../components/AuthForm/AuthForm';
import { validatePassword, validateUserName } from '../../utils/functions';

export default class LoginView extends View {
  private router: Router;

  constructor(router: Router) {
    super('div');

    this.router = router;

    this.render();
  }

  render() {
    const form = AuthForm({
      handleClickInfo: () => this.router.navigate(ROUTE_PATH.about),
      handleSubmit: this.handleLogin.bind(this),
    });

    this.getElement().append(form);
  }

  handleLogin(e: SubmitEvent) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const submitButton = target.children[1].children[1];
    const nameField = target.children[0].children[1];
    const passwordField = target.children[0].children[2];
    const inputName = nameField.children[1].children[0] as HTMLInputElement;
    const inputPassword = passwordField.children[1].children[0] as HTMLInputElement;

    const isNameValid = validateUserName(inputName.value);
    const isPasswordValid = validatePassword(inputPassword.value);

    if (!isNameValid || !isPasswordValid) return;
  }
}
