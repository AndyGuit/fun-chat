import { IRoute } from '../types/interfaces';

export default class Router {
  private routes: IRoute[];

  constructor(routes: IRoute[]) {
    this.routes = routes;

    this.initialNaviagion();
  }

  navigate(url: string) {
    const selectedRoute = this.routes.find((route) => route.path === url);

    if (selectedRoute) {
      selectedRoute.callback();
    }
  }

  initialNaviagion() {
    document.addEventListener('DOMContentLoaded', () => {
      const { pathname } = window.location;
      this.navigate(pathname);
    });
  }
}
