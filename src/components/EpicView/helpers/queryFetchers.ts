import { Issue } from "@canvas/types";

export const getEpics = (projectKey: string | undefined): Promise<Issue[]> => window.provider.getEpicsByProject(projectKey || "");
