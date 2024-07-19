import { IRoute } from '../types/interfaces';
import { ROUTE_PATH } from '../utils/globalVariables';

export default class Router {
  private routes: IRoute[];

  constructor(routes: IRoute[]) {
    this.routes = routes;

    this.initialNavigation();

    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  navigate(url: string) {
    const selectedRoute = this.routes.find((route) => route.path === url);

    if (selectedRoute) {
      window.history.pushState(null, '', selectedRoute.path);
      selectedRoute.callback();
    }
  }

  handlePopState(e: PopStateEvent) {
    const target = e.target as Window;
    e.preventDefault();
    this.navigate(target.location.pathname);
  }

  initialNavigation() {
    document.addEventListener('DOMContentLoaded', () => {
      const { pathname } = window.location;
      const hasCorrectPath = this.routes.some((route) => route.path === pathname);

      if (hasCorrectPath) {
        this.navigate(pathname);
      } else {
        this.navigate(ROUTE_PATH.index);
      }
    });
  }
}
