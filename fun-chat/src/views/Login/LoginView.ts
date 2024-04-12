import './LoginView.css';
import { ROUTE_PATH } from '../../utils/globalVariables';
import View from '../View';
import Router from '../../router/Router';
import AuthForm from '../../components/AuthForm/AuthForm';
import { validatePassword, validateUserName } from '../../utils/functions';
import SocketApi from '../../api/Api';
import UserState from '../../store/UserState';

export default class LoginView extends View {
  private router: Router;

  private api: SocketApi;

  private userState: UserState;

  constructor(router: Router, api: SocketApi, userState: UserState) {
    super('div');

    this.router = router;

    this.api = api;

    this.userState = userState;

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
    const nameField = target.children[0].children[1];
    const passwordField = target.children[0].children[2];
    const inputName = nameField.children[1].children[0] as HTMLInputElement;
    const inputPassword = passwordField.children[1].children[0] as HTMLInputElement;
    const userName = inputName.value;
    const userPassword = inputPassword.value;

    const isNameValid = validateUserName(userName);
    const isPasswordValid = validatePassword(userPassword);

    if (!isNameValid) nameField.classList.add('invalid');
    if (!isPasswordValid) passwordField.classList.add('invalid');

    if (!isNameValid || !isPasswordValid) return;

    this.api.login({ name: userName, password: userPassword });

    this.userState.setName(userName);
    this.userState.setPassword(userPassword);

    this.router.navigate(ROUTE_PATH.chat);
  }
}
