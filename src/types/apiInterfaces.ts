export enum MessageTypes {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_ACTIVE = 'USER_ACTIVE',
  USER_INACTIVE = 'USER_INACTIVE',
  USER_EXTERNAL_LOGIN = 'USER_EXTERNAL_LOGIN',
  USER_EXTERNAL_LOGOUT = 'USER_EXTERNAL_LOGOUT',
  ERROR = 'ERROR',
  MSG_SEND = 'MSG_SEND',
  MSG_DELIVER = 'MSG_DELIVER',
  MSG_FROM_USER = 'MSG_FROM_USER',
  MSG_READ = 'MSG_READ',
  MSG_DELETE = 'MSG_DELETE',
  MSG_EDIT = 'MSG_EDIT',
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

export interface IExternalUserSessionResponse {
  id: null;
  type: MessageTypes.USER_EXTERNAL_LOGIN | MessageTypes.USER_EXTERNAL_LOGOUT;
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
  };
}

export interface IDeliveredMessageResponse {
  id: null;
  type: MessageTypes.MSG_DELIVER;
  payload: {
    message: {
      id: string;
      status: {
        isDelivered: boolean;
      };
    };
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

export interface IMessageReadStatusChange {
  id: string;
  type: MessageTypes.MSG_READ;
  payload: {
    message: {
      id: string;
    };
  };
}

export interface IMessageDeleteRequest {
  id: string;
  type: MessageTypes.MSG_DELETE;
  payload: {
    message: {
      id: string;
    };
  };
}

export interface IMessageDeleteResponse {
  id: null;
  type: MessageTypes.MSG_DELETE;
  payload: {
    message: {
      id: string;
      status: {
        isDeleted: boolean;
      };
    };
  };
}

export interface IMessageReadStatusChangeResponse {
  id: null;
  type: MessageTypes.MSG_READ;
  payload: {
    message: {
      id: string;
      status: {
        isReaded: boolean;
      };
    };
  };
}

export interface IMessageEditRequest {
  id: string;
  type: MessageTypes.MSG_EDIT;
  payload: {
    message: {
      id: string;
      text: string;
    };
  };
}

export interface IMessageEditResponse {
  id: null;
  type: MessageTypes.MSG_EDIT;
  payload: {
    message: {
      id: string;
      text: string;
      status: {
        isEdited: boolean;
      };
    };
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

export type TMessages =
  | IUserActiveRequest
  | IUserInactiveRequest
  | ISendMessageRequest
  | IMessageHistoryRequest
  | IMessageReadStatusChange
  | IMessageDeleteRequest
  | IMessageEditRequest;
/* TODO: remove this type */
export type TServerResponses =
  | IUserAuthSuccessResponse
  | IUserLogoutSuccessResponse
  | IMessageReadStatusChangeResponse
  | IExternalUserSessionResponse
  | IDeliveredMessageResponse
  | IErrorResponse;
