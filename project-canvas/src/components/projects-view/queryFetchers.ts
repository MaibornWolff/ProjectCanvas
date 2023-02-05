import { IssueType } from "project-extender"

export const getIssueTypes = (): Promise<IssueType[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/issueTypes`)
    .then((issueTypes) => issueTypes.json())
    .catch((err) => err)

export const getProjects = (): Promise<IssueType[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/projects`)
    .then((_projects) => _projects.json())
    .catch((err) => err)
