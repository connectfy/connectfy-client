export enum REDUCER_PATH {
  PROFILE = "profilePath",
  AUTH = "authPath",
  GENERAL_SETTINGS = "generalSettingsPath",
  NOTIFICATIONS_SETTINGS = "notificationsSettingsPath",
  PRIVACY_SETTINGS = "privacySettingsPath",
}

export enum TAG_TYPES {
  PROFILE = "Profile",
  AUTH = "Auth",
  GENERAL_SETTINGS = "GeneralSettings",
  NOTIFICATIONS_SETTINGS = "NotificationsSettings",
  PRIVACY_SETTINGS = "PrivacySettings",
}

export enum LANGUAGE {
  EN = "en",
  AZ = "az",
  RU = "ru",
  TR = "tr",
}

export enum RESOURCE {
  AUTH = "auth",
  GENERAL_SETTINGS = "general_settings",
  PRIVACY_SETTINGS = "privacy_settings",
  NOTIFICATION_SETTINGS = "notification_settings",
  USER = "user",
  PROFILE = "profile",
  ACCOUNT_SETTINGS = "account_settings",
}

export enum ROLE {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

export enum PROVIDER {
  PASSWORD = "PASSWORD",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
}

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum IDENTIFIER_TYPE {
  USERNAME = "USERNAME",
  EMAIL = "EMAIL",
  PHONE_NUMBER = "PHONE_NUMBER",
  FACE_DESCRIPTOR = "FACE_DESCRIPTOR",
}

export enum FORGOT_PASSWORD_IDENTIFIER_TYPE {
  EMAIL = "EMAIL",
  PHONE_NUMBER = "PHONE_NUMBER",
}

export enum TOKEN_TYPE {
  PASSWORD_RESET = "PASSWORD_RESET",
  DELETE_ACCOUNT = "DELETE_ACCOUNT",
  RESTORE_ACCOUNT = "RESTORE_ACCOUNT",
  CHANGE_USERNAME = "CHANGE_USERNAME",
  CHANGE_EMAIL = "CHANGE_EMAIL",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
  CHANGE_PHONE_NUMBER = "CHANGE_PHONE_NUMBER",
  DEACTIVATE_ACCOUNT = "DEACTIVATE_ACCOUNT",
}

export enum PHONE_NUMBER_ACTION {
  UPDATE = "UPDATE",
  REMOVE = "REMOVE",
}

export enum PRIVACY_SETTINGS_CHOICE {
  EVERYONE = "EVERYONE",
  MY_FRIENDS = "MY_FRIENDS",
  NOBODY = "NOBODY",
}

export enum THEME {
  DARK = "dark",
  LIGHT = "light",
}

export enum NOTIFICATION_SOUND_MODE {
  SOUND = "SOUND",
  SILENT = "SILENT",
  DND = "DND",
}

export enum NOTIFICATION_CONTENT_MODE {
  HEADER_AND_CONTENT = "HEADER_AND_CONTENT",
  HEADER_ONLY = "HEADER_ONLY",
  HIDE_NOTIFICATION = "HIDE_NOTIFICATION",
}

export enum STARTUP_PAGE {
  MESSENGER = "MESSENGER",
  GROUPS = "GROUPS",
  CHANNELS = "CHANNELS",
  USERS = "USERS",
  NOTIFICATION = "NOTIFICATION",
  PROFILE = "PROFILE",
}

export enum TIME_FORMAT {
  H24 = "24h",
  H12 = "12h",
}

export enum DATE_FORMAT {
  DDMMYYYY = "DD/MM/YYYY",
  MMDDYYYY = "MM/DD/YYYY",
}

export enum DELETE_REASON {
  USER_REQUEST = "USER_REQUEST",
  TERMS_VIOLATION = "TERMS_VIOLATION",
  SPAM = "SPAM",
  FRAUD = "FRAUD",
  SECURITY = "SECURITY",
  INACTIVITY = "INACTIVITY",
  ADMIN_ACTION = "ADMIN_ACTION",
  OTHER = "OTHER",
}

export enum SOCIAL_LINK_PLATFORM {
  INSTAGRAM = "Instagram",
  FACEBOOK = "Facebook",
  TWITTER = "Twitter",
  LINKEDIN = "Linkedin",
  YOUTUBE = "Youtube",
  GITHUB = "Github",
  REDDIT = "Reddit",
  PINTEREST = "Pinterest",
  TIKTOK = "Tiktok",
  TELEGRAM = "Telegram",
  DISCORD = "Discord",
  SNAPCHAT = "Snapchat",
  WHATSAPP = "Whatsapp",
  MEDIUM = "Medium",
  DEVTO = "Devto",
  DRIBBBLE = "Dribbble",
  BEHANCE = "Behance",
  VIMEO = "Vimeo",
  STACKOVERFLOW = "Stackoverflow",
  EMAIL = "Email",
  WEBSITE = "Website",
  OTHER = "Other",
}
