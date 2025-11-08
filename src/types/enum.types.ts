export enum LANGUAGE {
  EN = "en",
  AZ = "az",
  RU = "ru",
  TR = "tr",
}

export enum Resource {
  auth = "auth",
}

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum IDENTIFIER_TYPE {
  USERNAME = 'USERNAME',
  EMAIL = 'EMAIL',
  PHONE_NUMBER = 'PHONE_NUMBER',
  FACE_DESCRIPTOR = 'FACE_DESCRIPTOR'
}

export enum FORGOT_PASSWORD_IDENTIFIER_TYPE {
  EMAIL = 'EMAIL',
  PHONE_NUMBER = 'PHONE_NUMBER',
}

export enum TOKEN_TYPE {
  PASSWORD_RESET = 'PASSWORD_RESET',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  RESTORE_ACCOUNT = 'RESTORE_ACCOUNT',
}