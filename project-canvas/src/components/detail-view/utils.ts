import { IssueBean } from "project-extender"

export const findCustomFieldByName = (
  issueBean: IssueBean,
  fieldName: string
): string | undefined => {
  const result = issueBean?.names
    ? Object.entries(issueBean.names).find(
        (field: [key: string, value: string]) => field[1] === fieldName
      )?.[0]
    : undefined
  return result || undefined
}
