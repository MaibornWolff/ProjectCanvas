export interface JiraServerUser {
  key: string;
  name: string;
  displayName: string;
  emailAddress: string;
  avatarUrls: {
    "16x16": string;
    "24x24": string;
    "32x32": string;
    "48x48": string;
  };
}

export interface JiraServerInfo {
  baseUrl: string;
  version: string;
  versionNumbers: [number, number, number];
  buildNumber: number;
  buildDate: string;
  serverTime: string;
  scmInfo: string;
  buildPartnerName: string;
  serverTitle: string;
}
