// import { Text } from "@mantine/core"
import { useEffect, useState } from "react"
// import { Project } from "project-extender/src/providers/base-provider/schema"

// import { useState, useEffect } from "react"
import { RowData, TableSort } from "./TableSort"
// import { data } from "./projectsData"

export function ProjectsView() {
  const [projects, setProjects] = useState<RowData[]>([])
  const getProjects = async () => {
    const data = await fetch(`${import.meta.env.VITE_EXTENDER}/projects`)

    setProjects(await data.json())
  }
  useEffect(() => {
    getProjects()
  }, [])

  return <TableSort data={projects} />
}
