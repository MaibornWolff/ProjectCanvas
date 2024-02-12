const NewIssueIdentifierPrefix = "$_";

export const createNewIssueIdentifier = (newIssueIndex: number) => NewIssueIdentifierPrefix + newIssueIndex.toString();

export const isNewIssueIdentifier = (id: string) => id.startsWith(NewIssueIdentifierPrefix);
