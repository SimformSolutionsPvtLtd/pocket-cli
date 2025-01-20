export interface DecodedToken {
  exp?: number; // Expiration time
  sub?: string;
  email?: string;
  app?: string;
  baseUrl?: string;
}

export enum FileType {
  Apk = 'apk',
  Ipa = 'ipa'
}

export enum AppPlatform {
  Android = 'android',
  IOS = 'ios'
}

export enum FileContentType {
  Ipa = 'application/octet-stream',
  Apk = 'application/vnd.android.package-archive'
}
