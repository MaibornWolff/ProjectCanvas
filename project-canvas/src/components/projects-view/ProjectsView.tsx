import { Project } from "project-extender"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ProjectsTable } from "./ProjectsTable"
import { useCanvasStore } from "../../lib/Store"
import { getIssueTypes } from "./queryFetchers"

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([])
  const { setStateProjects, setIssueTypes } = useCanvasStore()
  const getProjects = async () => {
    const data = await fetch(`${import.meta.env.VITE_EXTENDER}/projects`)
    const projectsArray = await data.json()
    setProjects(projectsArray)
    setStateProjects(projectsArray)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: issueTypes, isError: isErrorIssueTypes } = useQuery({
    queryKey: ["issueTypes"],
    queryFn: () => getIssueTypes(),
    onSuccess: (types) => setIssueTypes(types),
  })

  useEffect(() => {
    getProjects()
  }, [])

  return <ProjectsTable data={projects} />
}
