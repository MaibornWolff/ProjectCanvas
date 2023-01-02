// import { Text } from "@mantine/core"
import { useEffect, useState } from "react"
import { Project } from "project-extender/src/providers/base-provider/schema"

// import { useState, useEffect } from "react"
import { TableSort } from "./TableSort"
// import { data } from "./projectsData"

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([])
  const getProjects = async () => {
    const data = await fetch(`${import.meta.env.VITE_EXTENDER}/projects`)
    setProjects(await data.json())
  }
  useEffect(() => {
    getProjects()
  }, [])
  return (
    /*     <div>
      {projects?.map((project) => (
        <Text key={project.key}>
          id: {project.id} <br />
          name: {project.name} <br />
          key: {project.key} <br />
        </Text>
      ))}
    </div> */
    <TableSort data={projects} />
  )
}
