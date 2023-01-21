import { Project } from "project-extender"
import { useEffect, useState } from "react"
import { ProjectsTable } from "./ProjectsTable"

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([])
  const getProjects = async () => {
    const data = await fetch(`${import.meta.env.VITE_EXTENDER}/projects`)
    setProjects(await data.json())
  }

  useEffect(() => {
    getProjects()
  }, [])

  return <ProjectsTable data={projects} />
}
