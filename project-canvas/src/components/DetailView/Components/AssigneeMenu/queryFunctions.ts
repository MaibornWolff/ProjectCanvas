import { User } from "project-extender"

export const getAssignableUsersByProject = (
  projectIdOrKey: string
): Promise<User[]> =>
  window.provider.getAssignableUsersByProject(projectIdOrKey)
