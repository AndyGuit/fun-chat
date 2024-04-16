import { getLoginData } from '../utils/functions';

export default class UserState {
  private name: string;

  private password: string;

  dialogingWith: string;

  isLoggedIn: boolean;

  constructor() {
    const loginData = getLoginData();

    if (loginData) {
      this.isLoggedIn = true;
      this.name = loginData.name;
      this.password = loginData.password;
    } else {
      this.name = '';
      this.password = '';
      this.isLoggedIn = false;
    }

    this.dialogingWith = '';
  }

  setPassword(password: string) {
    this.password = password;
  }

  setName(name: string) {
    this.name = name;
  }

  getPassword() {
    return this.password;
  }

  getName() {
    return this.name;
  }
}
