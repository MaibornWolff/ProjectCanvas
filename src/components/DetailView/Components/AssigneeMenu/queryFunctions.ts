import { User } from "types"

export const getAssignableUsersByProject = (
  projectIdOrKey: string
): Promise<User[]> =>
  window.provider.getAssignableUsersByProject(projectIdOrKey)
