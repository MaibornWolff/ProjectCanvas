const NewIssueKeyPrefix = "$_";

export const createNewIssueKey = (newIssueIndex: number) => NewIssueKeyPrefix + newIssueIndex.toString();

export const isNewIssueKey = (newIssueKey: string) => newIssueKey.startsWith(NewIssueKeyPrefix);
