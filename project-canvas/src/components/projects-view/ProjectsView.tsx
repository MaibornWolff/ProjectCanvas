// import { useState, useEffect } from "react"
import { TableSort } from "./TableSort"
import { data } from "./projectsData"

export function ProjectsView() {
  // const [data, setData] = useState([])

  // useEffect(() => {
  //   // fetch("/rest/api/2/project")
  //   fetch("http://localhost:8080/project")
  //     .then((response) => response.json())
  //     .then((responseData) => {
  //       const formattedData = responseData.map(
  //         (item: { name: any; key: any; type: any; lead: any }) => ({
  //           // Star: IconStar,
  //           Name: item.name,
  //           Key: item.key,
  //           Type: item.type,
  //           Lead: item.lead,
  //         })
  //       )

  //       setData(formattedData)
  //     })
  // }, [])

  return <TableSort data={data} />
}
