import { Issue } from "types";

export const getEpicsByProject = (projectIdOrKey: string): Promise<Issue[]> => window.provider.getEpicsByProject(projectIdOrKey);
