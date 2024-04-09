import { IRoute } from '../types/interfaces';

export default class Router {
  private routes: IRoute[];

  constructor(routes: IRoute[]) {
    this.routes = routes;

    this.initialNaviagion();
  }

  navigate(url: string) {
    const route = this.routes.find((route) => route.path === url);

    if (route) {
      route.callback();
    }
  }

  initialNaviagion() {
    document.addEventListener('DOMContentLoaded', () => {
      const { pathname } = window.location;
      this.navigate(pathname);
    });
  }
}
