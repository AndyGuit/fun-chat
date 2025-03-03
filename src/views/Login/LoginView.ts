import './LoginView.css';
import { ROUTE_PATH } from '../../utils/globalVariables';
import View from '../View';
import Router from '../../router/Router';
import AuthForm from '../../components/AuthForm/AuthForm';
import { saveLoginData, validatePassword, validateUserName } from '../../utils/functions';
import SocketApi from '../../api/Api';
import UserState from '../../store/UserState';
import { MessageTypes, TLoginResponse } from '../../types/apiInterfaces';
import Overlay from '../../components/Overlay/Overlay';
import Loader from '../../components/Loader/Loader';

export default class LoginView extends View {
  private router: Router;

  private api: SocketApi;

  private userState: UserState;

  private overlayElement: HTMLDivElement;

  private loaderElement: HTMLDivElement;

  constructor(router: Router, api: SocketApi, userState: UserState) {
    super('div');

    this.router = router;

    this.api = api;

    this.userState = userState;

    this.overlayElement = Overlay();
    this.loaderElement = Loader();
    this.overlayElement.append(this.loaderElement);

    this.api.addCloseListener(this.checkConnectionListener.bind(this));
    this.api.addOpenListener(this.checkOpenListener.bind(this));
    this.api.addMessageListener(this.loginListener.bind(this));
    this.render();
  }

  render() {
    this.showLoading();
    const form = AuthForm({
      handleClickInfo: () => this.router.navigate(ROUTE_PATH.about),
      handleSubmit: this.handleLogin.bind(this),
    });

    this.getElement().append(this.overlayElement);
    this.getElement().append(form);
  }

  checkOpenListener() {
    this.hideLoading();
  }

  checkConnectionListener() {
    this.hideLoading();
    this.showModal('Oops, we lost connection with server. Please, try again later.');
  }

  showLoading() {
    this.overlayElement.classList.remove('hidden');
  }

  hideLoading() {
    this.overlayElement.classList.add('hidden');
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

    this.userState.name = userName;
    this.userState.setPassword(userPassword);
  }

  loginListener(e: MessageEvent<string>) {
    const data: TLoginResponse = JSON.parse(e.data);

    if (data.type === MessageTypes.USER_LOGIN) {
      this.userState.isLoggedIn = data.payload.user.isLogined;
      saveLoginData({ name: this.userState.name, password: this.userState.getPassword() });

      if (window.location.pathname === ROUTE_PATH.about) return;

      this.router.navigate(ROUTE_PATH.chat);
    }

    if (data.type === MessageTypes.ERROR) {
      this.showModal(data.payload.error);
    }
  }
}
