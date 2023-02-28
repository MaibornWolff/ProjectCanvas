import { Issue } from "project-extender"

export const getEpicsByProject = (projectIdOrKey: string): Promise<Issue[]> =>
  fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/epicsByProject?projectIdOrKey=${projectIdOrKey}`
  )
    .then((epics) => epics.json())
    .catch((err) => err)
