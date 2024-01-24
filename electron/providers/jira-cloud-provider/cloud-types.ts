export interface JiraCloudUser {
  accountId: string;
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
