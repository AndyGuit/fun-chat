export enum MessageTypes {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  ERROR = 'ERROR',
}

export interface IUserAuthRequest {
  id: string;
  type: MessageTypes.USER_LOGIN;
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
}

export interface IUserLogoutRequest {
  id: string;
  type: MessageTypes.USER_LOGOUT;
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
}

export interface IUserAuthSuccessResponse {
  id: string;
  type: MessageTypes.USER_LOGIN;
  payload: {
    user: {
      isLogined: boolean;
      login: string;
    };
  };
}

export interface IUserLogoutSuccessResponse {
  id: string;
  type: MessageTypes.USER_LOGOUT;
  payload: {
    user: {
      isLogined: boolean;
      login: string;
    };
  };
}

export interface IErrorResponse {
  id: string;
  type: MessageTypes.ERROR;
  payload: {
    error: string;
  };
}

export type TServerResponses =
  | IUserAuthSuccessResponse
  | IUserLogoutSuccessResponse
  | IErrorResponse;
