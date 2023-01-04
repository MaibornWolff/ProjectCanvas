import { Button, Navbar } from "@mantine/core"
import { useNavigate } from "react-router-dom"

export function LayoutNavbar() {
  const navigate = useNavigate()

  return (
    <Navbar width={{ base: 300 }} sx={{ zIndex: "auto" }} height="100%" p="xs">
      <Navbar.Section mt="xs">
        <Button onClick={() => navigate("/projectsview")}>Projects View</Button>
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        <Button onClick={() => navigate("/backlogview")}>Backlog View</Button>
      </Navbar.Section>
    </Navbar>
  )
}
