import { Text } from "@mantine/core"
import { useEffect, useState } from "react"

// import { useState, useEffect } from "react"
// import { TableSort } from "./TableSort"
// import { data } from "./projectsData"

export function ProjectsView() {
  const [projects, setProjects] = useState<{ name: string; key: string }[]>()
  const getProjects = async () => {
    const data = await fetch(`${import.meta.env.VITE_EXTENDER}/projects`)
    setProjects(await data.json())
  }
  useEffect(() => {
    getProjects()
  }, [])

  return (
    <div>
      {projects?.map((project) => (
        <Text key={project.key}>
          name: {project.name} <br />
          key: {project.key} <br />
        </Text>
      ))}
    </div>
    // return <TableSort data={data} />
  )
}
