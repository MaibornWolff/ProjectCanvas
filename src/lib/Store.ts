import { IssueStatus, IssueType, Project, StatusType } from "@canvas/types";
import { create } from "zustand";
import { uniqWith } from "lodash";

export interface CanvasStore {
  projects: Project[],
  selectedProject: Project | undefined,
  selectedProjectBoardIds: number[],
  issueTypes: IssueType[],
  issueTypesWithFieldsMap: Map<string, string[]>,
  issueStatus: IssueStatus[],
  issueStatusByCategory: Partial<{ [Type in StatusType]: IssueStatus[] }>,
  issueStatusCategoryByStatusName: { [statusName: string]: StatusType },
  setProjects: (projects: Project[]) => void,
  setSelectedProject: (project: Project) => void,
  setSelectedProjectBoardIds: (boards: number[]) => void,
  setIssueTypes: (types: IssueType[]) => void,
  setIssueTypesWithFieldsMap: (issueTypesWithFieldsMap: Map<string, string[]>) => void,
}

export const useCanvasStore = create<CanvasStore>()((set) => ({
  projects: [],
  selectedProject: undefined,
  selectedProjectBoardIds: [],
  issueTypes: [],
  issueTypesWithFieldsMap: new Map<string, string[]>(),
  issueStatus: [],
  issueStatusByCategory: {},
  issueStatusCategoryByStatusName: {},
  setProjects: (projects: Project[]) => set(() => ({ projects })),
  setSelectedProjectBoardIds: (boards: number[]) => set(() => ({ selectedProjectBoardIds: boards })),
  setSelectedProject: (row: Project | undefined) => set(() => ({ selectedProject: row })),
  setIssueTypes: (issueTypes: IssueType[]) => set(() => {
    const issueStatus = uniqWith(
      issueTypes.flatMap((type) => type.statuses ?? []),
      (statusA, statusB) => statusA.id === statusB.id,
    );

    const issueStatusByCategory = {} as {
      [Type in StatusType]: IssueStatus[];
    };
    const issueStatusCategoryByStatusName = {} as {
      [statusName: string]: StatusType,
    };
    issueStatus.forEach((status) => {
      issueStatusByCategory[status.statusCategory.name as StatusType] ??= [];
      issueStatusByCategory[status.statusCategory.name as StatusType].push(
        status,
      );
      issueStatusCategoryByStatusName[status.name] = status.statusCategory
        .name as StatusType;
    });

    return {
      issueTypes,
      issueStatus,
      issueStatusByCategory,
      issueStatusCategoryByStatusName,
    };
  }),
  setIssueTypesWithFieldsMap: (issueTypesWithFieldsMap: Map<string, string[]>) => set(() => ({
    issueTypesWithFieldsMap,
  })),
}));
