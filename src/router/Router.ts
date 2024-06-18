import { IRoute } from '../types/interfaces';

export default class Router {
  private routes: IRoute[];

  constructor(routes: IRoute[]) {
    this.routes = routes;

    this.initialNaviagion();

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

  initialNaviagion() {
    document.addEventListener('DOMContentLoaded', () => {
      const { pathname } = window.location;
      this.navigate(pathname);
    });
  }
}
