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
  GENERAL_SETTINGS = "general-settings",
  PRIVACY_SETTINGS = "privacy-settings",
  NOTIFICATION_SETTINGS = "notification-settings",
  USER = "user",
  PROFILE = "profile",
  ACCOUNT_SETTINGS = "account-settings",
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
  TWO_FACTOR = "TWO_FACTOR",
}

export enum TWO_FACTOR_ACTION {
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
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
  DARK = "DARK",
  LIGHT = "LIGHT",
  DEVICE = "DEVICE",
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

export enum LOCAL_STORAGE_KEYS {
  LANG = "lang",
  ACCESS_TOKEN = "access_token",
  DEVICE_ID = "deviceId",
  APP_THEME = "app-theme",
  AUTH_PAGE = "auth-page",
  LOGIN_MODE = "login-mode",
  FORGOT_PASSWORD_MODE = "forgot-password-mode",
  OTP_EXPIRES_AT = "otp_expires_at",
  SIGNUP_FORM = "signup_form",
}

export enum TIME_DIFFERENCE_TYPE {
  NOW = "just_now",
  SECOND = "seconds_ago",
  MINUTE = "minutes_ago",
  HOUR = "hours_ago",
  DAY = "days_ago",
  WEEK = "weeks_ago",
  MONTH = "months_ago",
  YEAR = "years_ago",
}

export enum CHECK_UNIQUE_FIELD {
  USERNAME = "username",
  EMAIL = "email",
  PHONE_NUMBER = "phone_number",
}

export enum ModalView {
  SELECTION = "SELECTION",
  FORM = "FORM",
}

export enum DELETE_REASON_CODE {
  NOT_USEFUL = "NOT_USEFUL",
  PRIVACY_CONCERNS = "PRIVACY_CONCERNS",
  FOUND_ALTERNATIVE = "FOUND_ALTERNATIVE",
  TECHNICAL_ISSUES = "TECHNICAL_ISSUES",
  OTHER = "OTHER",
}
