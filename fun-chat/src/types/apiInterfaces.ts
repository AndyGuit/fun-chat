export enum MessageTypes {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_ACTIVE = 'USER_ACTIVE',
  USER_INACTIVE = 'USER_INACTIVE',
  ERROR = 'ERROR',
  MSG_SEND = 'MSG_SEND',
  MSG_FROM_USER = 'MSG_FROM_USER',
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

export interface ISendMessageRequest {
  id: string;
  type: MessageTypes.MSG_SEND;
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
}

export interface ISendMessageResponse {
  id: string;
  type: MessageTypes.MSG_SEND;
  payload: {
    message: IMessage;
  };
}

export interface IMessageHistoryRequest {
  id: string;
  type: MessageTypes.MSG_FROM_USER;
  payload: {
    user: {
      login: string;
    };
  };
}

export interface IMessageHistoryResponse {
  id: string;
  type: MessageTypes.MSG_FROM_USER;
  payload: {
    messages: IMessage[];
  };
}

export interface IUser {
  login: string;
  isLogined: boolean;
}

export interface IMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
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

export type TMessages = IUserActiveRequest | IUserInactiveRequest | ISendMessageRequest;

export type TServerResponses =
  | IUserAuthSuccessResponse
  | IUserLogoutSuccessResponse
  | IErrorResponse;
