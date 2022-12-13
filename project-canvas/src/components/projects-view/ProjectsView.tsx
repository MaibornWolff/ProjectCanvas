// import { Container, Flex, Input, Table, TextInput, Title } from "@mantine/core"
// import { IconSearch, IconStar } from "@tabler/icons"

import { data } from "./projectsData"
import { TableSort } from "./TableSort"

// const projects = [
//   { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
//   { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
//   { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
//   { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
//   { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
// ]

// export function ProjectsView() {
//   const rows = projects.map((project) => (
//     <tr key={project.name}>
//       <td>{project.position}</td>
//       <td>{project.name}</td>
//       <td>{project.symbol}</td>
//       <td>{project.mass}</td>
//     </tr>
//   ))

//   return (
//     <Container>
//       <Title>Projects</Title>
//       <Flex>
//         {/* <TextInput
//           label="Search"
//           placeholder="..."
//           rightSection={<IconSearch size="20px" />}
//           size="sm"
//         /> */}
//         <Input.Wrapper
//           id="projects-view-search"
//           label="Search"
//           description="Please search for a project"
//           size="sm"
//           error="Sorry :( No results match your search query"
//         >
//           <Input id="input-demo" placeholder="Your email" />
//         </Input.Wrapper>
//       </Flex>
//       <Table striped highlightOnHover withBorder withColumnBorders>
//         <thead>
//           <tr>
//             <th>
//               <IconStar size="18px" />
//             </th>
//             <th>Name</th>
//             <th>Key</th>
//             <th>Symbol</th>
//             <th>Atomic mass</th>
//           </tr>
//         </thead>
//         <tbody>{rows}</tbody>
//       </Table>
//     </Container>
//   )
// }
export function ProjectsView() {
  return <TableSort data={data} />
}
