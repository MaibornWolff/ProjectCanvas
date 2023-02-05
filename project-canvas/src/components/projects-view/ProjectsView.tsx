import { IssueType, Project } from "project-extender"
import { useQuery } from "@tanstack/react-query"
import { Center, Loader } from "@mantine/core"
import { ProjectsTable } from "./ProjectsTable"
import { useCanvasStore } from "../../lib/Store"
import { getIssueTypes, getProjects } from "./queryFetchers"

export function ProjectsView() {
  const { setProjects, setIssueTypes } = useCanvasStore()
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    onSuccess: (_projects: Project[]) => {
      setProjects(_projects)
    },
  })

  useQuery({
    queryKey: ["issueTypes"],
    queryFn: getIssueTypes,
    onSuccess: (issueTypes: IssueType[]) => {
      setIssueTypes(issueTypes)
    },
  })

  if (isLoading)
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Loader />
      </Center>
    )

  return (
    projects && <ProjectsTable data={projects.map(({ id, ...rest }) => rest)} />
  )
}
