import { useEffect, useState } from "react"
import { ProjectData, ProjectsTable } from "./ProjectsTable"

export function ProjectsView() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const getProjects = async () => {
    const data = await fetch(`${import.meta.env.VITE_EXTENDER}/projects`)

    setProjects(await data.json())
  }
  useEffect(() => {
    getProjects()
  }, [])

  return <ProjectsTable data={projects} />
}
