import { getLoginData } from '../utils/functions';

export default class UserState {
  private name: string;

  private password: string;

  isLoggedIn: boolean;

  constructor() {
    const loginData = getLoginData();

    console.log(loginData);

    if (loginData) {
      this.isLoggedIn = true;
      this.name = loginData.name;
      this.password = loginData.password;
    } else {
      this.name = '';
      this.password = '';
      this.isLoggedIn = false;
    }
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
