export enum MessageTypes {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_ACTIVE = 'USER_ACTIVE',
  USER_INACTIVE = 'USER_INACTIVE',
  ERROR = 'ERROR',
}

export enum ReadyStateStatus {
  CONNETCING,
  OPEN,
  CLOSING,
  CLOSED,
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

export interface IUserActiveRequest {
  id: string;
  type: MessageTypes.USER_ACTIVE;
  payload: null;
}

export interface IUserInactiveRequest {
  id: string;
  type: MessageTypes.USER_INACTIVE;
  payload: null;
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

export interface IUserActiveResponse {
  id: string;
  type: MessageTypes.USER_ACTIVE;
  payload: {
    users: Array<IUser>;
  };
}

export interface IUserInactiveResponse {
  id: string;
  type: MessageTypes.USER_INACTIVE;
  payload: {
    users: Array<IUser>;
  };
}

export interface IUser {
  login: string;
  isLogined: boolean;
}

export interface IErrorResponse {
  id: string;
  type: MessageTypes.ERROR;
  payload: {
    error: string;
  };
}

export type TLoginResponse = IUserAuthSuccessResponse | IErrorResponse;
export type TLogoutResponse = IUserLogoutSuccessResponse | IErrorResponse;

export type TServerResponses =
  | IUserAuthSuccessResponse
  | IUserLogoutSuccessResponse
  | IErrorResponse;
