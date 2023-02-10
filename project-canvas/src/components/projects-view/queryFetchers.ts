import { IssueType } from "project-extender"

export const getProjects = (): Promise<IssueType[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/projects`)
    .then((_projects) => _projects.json())
    .catch((err) => err)
